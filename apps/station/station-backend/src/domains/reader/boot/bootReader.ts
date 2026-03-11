import type {
  NodeDatetimeService,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import { Environment } from "@marginal-card/backend-framework";
import type { StationSubscriptionTopics } from "@marginal-card/station-sdk";
import PCSC from "@tockawa/nfc-pcsc";

import { ReaderManager } from "../infra/readerManager";
import { UriPrefix } from "../infra/utils/uriPrefix";

export function bootReader(
  dateTimeService: NodeDatetimeService,
  subscriptionRegistry: SubscriptionRegistry<StationSubscriptionTopics>,
) {
  const readerManager = new ReaderManager(
    Environment.get("URI_PREFIX") === "https"
      ? UriPrefix.HTTPS
      : UriPrefix.HTTP,
    Environment.get("KEY_PATH"),
    subscriptionRegistry,
    dateTimeService,
  );

  const pcsc = new PCSC();

  pcsc.on("reader", (reader) => {
    readerManager.register(reader).catch(console.error);
  });

  return { readerManager };
}
