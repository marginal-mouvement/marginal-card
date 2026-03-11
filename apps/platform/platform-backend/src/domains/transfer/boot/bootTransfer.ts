import type { Db } from "mongodb";
import type {
  InMemoryEventBus,
  InMemoryIntentBus,
} from "@marginal-card/backend-framework";

import { MongoTransferStore } from "../infra/mongo.transfer.store";
import { CreateTransferCommandHandler } from "../application/commands/createTransfer.command";
import { TransferSaga } from "../application/transfer.saga";

export function bootTransfer(
  db: Db,
  intentBus: InMemoryIntentBus,
  eventBus: InMemoryEventBus,
) {
  const transferStore = new MongoTransferStore(db);

  intentBus.register(new CreateTransferCommandHandler(transferStore));

  new TransferSaga(intentBus).listen(eventBus);
}
