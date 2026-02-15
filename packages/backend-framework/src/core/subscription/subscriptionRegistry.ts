import {
  SubscriptionId,
  SubscriptionIdString,
} from "../value/values/subscriptionId";

export type Topic = string & { _type?: "Topic" };

type Handler = (message: string) => void;

export class SubscriptionRegistry {
  private readonly subscriptions = new Map<SubscriptionIdString, Handler>();
  private readonly topicToSubs = new Map<Topic, Set<SubscriptionIdString>>();
  private readonly subToTopics = new Map<SubscriptionIdString, Set<Topic>>();

  registerHandler(id: SubscriptionId, handler: Handler) {
    this.subscriptions.set(id.toSubscriptionIdString(), handler);
  }

  unregisterHandler(id: SubscriptionId) {
    const subscriptionIdString = id.toSubscriptionIdString();
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

  subscribe(topic: Topic, id: SubscriptionId) {
    const subscriptionIdString = id.toSubscriptionIdString();
    const subs = this.topicToSubs.get(topic) ?? new Set();
    subs.add(subscriptionIdString);
    this.topicToSubs.set(topic, subs);

    const topics = this.subToTopics.get(subscriptionIdString) ?? new Set();
    topics.add(topic);
    this.subToTopics.set(subscriptionIdString, topics);
  }

  unsubscribe(topic: Topic, subscriptionId: SubscriptionId) {
    const subscriptionIdString = subscriptionId.toSubscriptionIdString();
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

  publish(topics: Topic[], message: string) {
    const recipients = new Set<SubscriptionIdString>();

    for (const topic of topics) {
      const subs = this.topicToSubs.get(topic);
      if (!subs) continue;
      for (const id of subs) recipients.add(id);
    }

    for (const id of recipients) {
      const handler = this.subscriptions.get(id);
      handler?.(message);
    }
  }
}
