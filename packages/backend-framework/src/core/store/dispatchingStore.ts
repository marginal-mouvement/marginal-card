import { IEventSourced, IIdentifiable } from "@ddd-ts/core";
import { Constructor } from "@ddd-ts/types";
import { Store } from "./store";
import { EventBus } from "../eventBus";
import { Transaction } from "./transaction";

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
