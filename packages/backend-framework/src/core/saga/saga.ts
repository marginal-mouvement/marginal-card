import type { Constructor } from "@ddd-ts/types";
import type { IEvent } from "@ddd-ts/core";

import type { EventBus } from "../eventBus";
import type { EventCallback } from "../eventBus/eventBus";

export class Saga {
  static handlers: Map<Constructor<IEvent>, Set<EventCallback<any>>>;

  listen(eventBus: EventBus) {
    const allHandlers = (this.constructor as typeof Saga).handlers;

    for (const [event, handlers] of allHandlers) {
      for (const handler of handlers) {
        eventBus.on(event, async (event) => {
          await handler.bind(this)(event);
        });
      }
    }
  }

  static registerHandler<E extends IEvent>(
    eventType: Constructor<E>,
    handler: (event: E) => any,
  ) {
    if (!this.handlers) {
      this.handlers = new Map<Constructor<IEvent>, Set<EventCallback<any>>>();
    }
    const handlers = this.handlers.get(eventType) || new Set();
    handlers.add(handler);
    this.handlers.set(eventType, handlers);
  }

  static on<E extends IEvent>(event: Constructor<E>) {
    return <P extends Saga>(
      target: P,
      _key: string,
      descriptor: TypedPropertyDescriptor<(event: E) => any>,
    ) => {
      const targetConstructor = target.constructor as typeof Saga;
      targetConstructor.registerHandler(event, descriptor.value as any);
      return descriptor;
    };
  }
}
