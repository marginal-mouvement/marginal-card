import type { SubscriptionEvent } from "@marginal-card/types";

import type { SubscriptionId } from "../value";
import { parallel } from "../concurrency";
import { ApplicationError } from "../error";
import type { DatetimeService } from "../misc";

type Handler<E extends SubscriptionEvent<any, any>> = (
  message: E,
) => Promise<void>;

interface Channel<E extends SubscriptionEvent<any, any>> {
  handler: Handler<E>;
  token: symbol;
}

type AnyEvent<T extends { [key: string]: SubscriptionEvent<any, any> }> =
  T[keyof T];

interface SubscriptionManifest {
  createdAt: number;
  attachedAt?: number;
  detachedAt?: number;
}

export class SubscriptionRegistry<
  T extends { [key: string]: SubscriptionEvent<any, any> },
> {
  constructor(private readonly dateTimeService: DatetimeService) {}

  private readonly subscriptionIds = new Map<string, SubscriptionManifest>();
  private readonly channels = new Map<string, Channel<AnyEvent<T>>>();
  private readonly topicToSubs = new Map<keyof T, Set<string>>();
  private readonly subToTopics = new Map<string, Set<keyof T>>();

  registerSubscriptionId(id: SubscriptionId) {
    this.subscriptionIds.set(id.serialize(), {
      createdAt: this.dateTimeService.now().getTime(),
    });
  }

  registerHandler(id: SubscriptionId, handler: Handler<T[keyof T]>) {
    const token = Symbol();

    const subscriptionManifest = this.subscriptionIds.get(id.serialize());

    if (!subscriptionManifest) {
      throw ApplicationError.notFound("Subscription", id);
    }

    subscriptionManifest.detachedAt = undefined;
    subscriptionManifest.attachedAt = this.dateTimeService.now().getTime();

    this.channels.set(id.serialize(), {
      handler,
      token,
    });
    return token;
  }

  detachConnectionIfCurrent(id: SubscriptionId, token: symbol) {
    const subscriptionIdString = id.serialize();
    const current = this.channels.get(subscriptionIdString);

    if (current?.token !== token) {
      return;
    }

    this.channels.delete(subscriptionIdString);

    const subscriptionManifest = this.subscriptionIds.get(subscriptionIdString);

    if (subscriptionManifest) {
      subscriptionManifest.detachedAt = this.dateTimeService.now().getTime();
    }
  }

  deleteSubscription(id: SubscriptionId) {
    const subscriptionIdString = id.serialize();

    this.subscriptionIds.delete(subscriptionIdString);
    this.channels.delete(subscriptionIdString);

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
      const handlerManifest = this.channels.get(id);
      await handlerManifest?.handler?.(event);
    });
  }
}
