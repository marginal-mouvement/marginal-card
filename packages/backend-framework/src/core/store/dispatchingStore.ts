import type { IEventSourced, IIdentifiable } from "@ddd-ts/core";
import type { Constructor } from "@ddd-ts/types";

import type { Store } from "./store";
import type { Transaction } from "./transaction";

import type { EventBus } from "../eventBus";

export function DispatchingStore<
  const M extends IIdentifiable & IEventSourced,
  const Base extends Constructor<Store<M>>,
>(of: Base) {
  return class DispatchingStore extends of {
    private eventBus?: EventBus;

    publishAggregateEventsTo(eventBus: EventBus) {
      this.eventBus = eventBus;
      return this;
    }

    override async save(model: M, transaction?: Transaction) {
      await super.save(model, transaction);
      const changes = model.changes;
      model.acknowledgeChanges();

      if (transaction) {
        transaction.onCommit(async () => {
          for (const event of changes) {
            await this.eventBus?.publish(event);
          }
        });
      } else {
        for (const event of changes) {
          await this.eventBus?.publish(event);
        }
      }
    }
  } as Base &
    Constructor<{
      publishAggregateEventsTo<T extends InstanceType<Base>>(
        this: T,
        eventBus: EventBus,
      ): T;
    }>;
}
