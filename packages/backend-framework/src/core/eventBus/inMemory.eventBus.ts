import { IEvent } from "@ddd-ts/core";
import { Constructor } from "@ddd-ts/types";
import { EventBus, EventCallback } from "./eventBus";
import { parallel } from "../concurrency";

export class InMemoryEventBus implements EventBus {
  private events = new Map<Constructor<IEvent>, Set<EventCallback<IEvent>>>();

  private pendingEventsCount = 0;
  private idleResolvers: Array<(value: void | PromiseLike<void>) => void> = [];

  private checkIdle() {
    if (this.pendingEventsCount === 0) {
      const idleResolvers = this.idleResolvers;
      this.idleResolvers = [];
      for (const resolver of idleResolvers) {
        resolver();
      }
    }
  }

  on<T extends IEvent>(
    event: Constructor<T>,
    callback: (event: T) => void | Promise<void>,
  ) {
    const callbacks: Set<EventCallback<T>> =
      this.events.get(event) ?? new Set();

    callbacks.add(callback);

    this.events.set(event, callbacks as any);
  }

  off<T extends IEvent>(
    event: Constructor<T>,
    callback: (event: T) => void | Promise<void>,
  ) {
    const callbacks: Set<EventCallback<T>> =
      this.events.get(event) ?? new Set();

    callbacks.delete(callback);

    this.events.set(event, callbacks as any);
  }

  async publish<T extends IEvent>(
    event: T,
    { executeSync }: { executeSync: boolean } = { executeSync: false },
  ): Promise<void> {
    const handlers: Set<EventCallback<T>> =
      this.events.get(event.constructor as Constructor<IEvent>) ?? new Set();

    this.pendingEventsCount++;

    const promise = parallel(handlers, 20, async (handler) => handler(event))
      .catch((e) => console.error(e))
      .finally(() => {
        this.pendingEventsCount--;
        this.checkIdle();
      });

    if (executeSync) {
      await promise;
    }
  }

  async waitForIdle() {
    if (this.pendingEventsCount === 0) {
      return;
    }

    return new Promise<void>((resolve) => {
      this.idleResolvers.push(resolve);
    });
  }
}
