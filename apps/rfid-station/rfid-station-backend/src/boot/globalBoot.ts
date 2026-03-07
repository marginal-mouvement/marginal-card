import {
  NodeDatetimeService,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import type { RfidStationSubscriptionTopics } from "@marginal-card/rfid-station-sdk";

import { bootReader } from "../domains/reader/boot/bootReader";

export function globalBoot() {
  const subscriptionRegistry =
    new SubscriptionRegistry<RfidStationSubscriptionTopics>();

  const dateTimeService = new NodeDatetimeService();

  const { readerManager } = bootReader(dateTimeService, subscriptionRegistry);

  return { readerManager, subscriptionRegistry };
}
