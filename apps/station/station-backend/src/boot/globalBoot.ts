import {
  NodeDatetimeService,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import type { StationSubscriptionTopics } from "@marginal-card/station-sdk";

import { bootReader } from "../domains/reader/boot/bootReader";

export function globalBoot() {
  const dateTimeService = new NodeDatetimeService();

  const subscriptionRegistry =
    new SubscriptionRegistry<StationSubscriptionTopics>(dateTimeService);

  subscriptionRegistry.configureCleanCrawler(1000 * 60 * 5);

  const { readerManager } = bootReader(dateTimeService, subscriptionRegistry);

  return { readerManager, subscriptionRegistry };
}
