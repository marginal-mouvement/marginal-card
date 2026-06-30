import type {
  IntentBus,
  SubscriptionRegistry,
} from "@marginal-card/backend-framework";
import type { StationTopics } from "@marginal-card/station-sdk";

import { CreateSubscriptionCommandHandler } from "../application/createSubscription.command";

export function bootSubscription(
  intentBus: IntentBus,
  subscriptionRegistry: SubscriptionRegistry<StationTopics>,
) {
  intentBus.register(
    new CreateSubscriptionCommandHandler(subscriptionRegistry),
  );
}
