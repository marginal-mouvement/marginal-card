import type {
  InMemoryEventBus,
  InMemoryIntentBus,
  MongoTransactionPerformer,
  NodeDatetimeService,
} from "@marginal-card/backend-framework";
import type { Db } from "mongodb";

import { ClaimKeyCommandHandler } from "../application/commands/claimKey.command";
import type { MongoKeyStore } from "../../key/infra/mongo.key.store";
import { MongoUserStore } from "../infra/mongo.userStore";
import { CreditUserBalanceCommandHandler } from "../application/commands/creditUserBalance.command";
import { DebitUserBalanceCommandHandler } from "../application/commands/debitUserBalance.command";

export function bootUser(
  intentBus: InMemoryIntentBus,
  keyStore: MongoKeyStore,
  transactionPerformer: MongoTransactionPerformer,
  eventBus: InMemoryEventBus,
  dateTimeService: NodeDatetimeService,
  db: Db,
) {
  const userStore = new MongoUserStore(db).publishAggregateEventsTo(eventBus);

  intentBus.register(
    new ClaimKeyCommandHandler(userStore, keyStore, transactionPerformer),
  );

  intentBus.register(
    new CreditUserBalanceCommandHandler(
      transactionPerformer,
      userStore,
      dateTimeService,
    ),
  );

  intentBus.register(
    new DebitUserBalanceCommandHandler(
      transactionPerformer,
      userStore,
      dateTimeService,
    ),
  );

  return { userStore };
}
