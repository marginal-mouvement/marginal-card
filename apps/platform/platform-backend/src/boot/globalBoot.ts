import {
  InMemoryEventBus,
  InMemoryIntentBus,
  MongoTransactionPerformer,
  NodeDatetimeService,
} from "@marginal-card/backend-framework";

import { bootKey } from "../domains/key/application/boot/bootKey";
import { db } from "../infra/db";
import { bootUser } from "../domains/user/boot/bootUser";
import { bootAuth } from "../domains/auth/boot/bootAuth";

export function globalBoot() {
  const intentBus = new InMemoryIntentBus();
  const dateTimeService = new NodeDatetimeService();
  const eventBus = new InMemoryEventBus();
  const transactionPerformer = new MongoTransactionPerformer(db);

  const { keyStore } = bootKey(db, intentBus);

  bootUser(
    intentBus,
    keyStore,
    transactionPerformer,
    eventBus,
    dateTimeService,
    db,
  );

  const { authenticator } = bootAuth(db, keyStore, dateTimeService);

  return {
    intentBus,
    authenticator,
  };
}
