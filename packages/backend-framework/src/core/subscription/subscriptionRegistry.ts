import type { SubscriptionEvent } from "@marginal-card/types";

import type { SubscriptionId } from "../value";
import { parallel } from "../concurrency";

type Handler<E extends SubscriptionEvent<any, any>> = (
  message: E,
) => Promise<void>;

export class SubscriptionRegistry<
  T extends { [key: string]: SubscriptionEvent<any, any> },
> {
  private readonly subscriptions = new Map<keyof T, Handler<T[keyof T]>>();
  private readonly topicToSubs = new Map<keyof T, Set<string>>();
  private readonly subToTopics = new Map<string, Set<keyof T>>();

  registerHandler(id: SubscriptionId, handler: Handler<T[keyof T]>) {
    this.subscriptions.set(id.serialize(), handler);
  }

  unregisterHandler(id: SubscriptionId) {
    const subscriptionIdString = id.serialize();
    this.subscriptions.delete(subscriptionIdString);
    const topics = this.subToTopics.get(subscriptionIdString);
    if (topics) {
      for (const topic of topics) {
        const subs = this.topicToSubs.get(topic);

        if (!subs) {
          continue;
        }

        subs.delete(subscriptionIdString);

        if (subs.size === 0) {
          this.topicToSubs.delete(topic);
        }
      }
    }

    this.subToTopics.delete(subscriptionIdString);
  }

  subscribe(topic: keyof T, id: SubscriptionId) {
    const subscriptionIdString = id.serialize();
    const subs = this.topicToSubs.get(topic) ?? new Set();
    subs.add(subscriptionIdString);
    this.topicToSubs.set(topic, subs);

    const topics = this.subToTopics.get(subscriptionIdString) ?? new Set();
    topics.add(topic);
    this.subToTopics.set(subscriptionIdString, topics);
  }

  unsubscribe(topic: keyof T, subscriptionId: SubscriptionId) {
    const subscriptionIdString = subscriptionId.serialize();
    const topics = this.subToTopics.get(subscriptionIdString);

    if (topics) {
      topics?.delete(topic);
      if (topics.size === 0) {
        this.subToTopics.delete(subscriptionIdString);
      }
    }

    const subs = this.topicToSubs.get(topic);

    if (subs) {
      subs.delete(subscriptionIdString);

      if (subs.size === 0) {
        this.topicToSubs.delete(topic);
      }
    }
  }

  async publish<TargetedTopics extends keyof T>(
    topics: Array<TargetedTopics>,
    event: T[TargetedTopics],
  ) {
    const recipients = new Set<string>();

    for (const topic of topics) {
      const subs = this.topicToSubs.get(topic);
      if (!subs) continue;
      for (const id of subs) recipients.add(id);
    }

    await parallel(recipients, 20, async (id) => {
      const handler = this.subscriptions.get(id);
      await handler?.(event);
    });
  }
}
