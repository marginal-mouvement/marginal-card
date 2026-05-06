import {
  InMemoryIntentBus,
  NodeDatetimeService,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import type { StationTopics } from "@marginal-card/station-sdk";

import { bootReader } from "../domains/reader/boot/bootReader";
import { bootSubscription } from "../domains/subscription/boot/bootSubscription";

export function globalBoot() {
  const dateTimeService = new NodeDatetimeService();
  const intentBus = new InMemoryIntentBus();

  const subscriptionRegistry = new SubscriptionRegistry<StationTopics>(
    dateTimeService,
  );

  subscriptionRegistry.configureCleanCrawler(1000 * 60 * 5);

  const { readerManager } = bootReader(dateTimeService, subscriptionRegistry);

  bootSubscription(intentBus, subscriptionRegistry);

  return { readerManager, subscriptionRegistry, intentBus };
}
