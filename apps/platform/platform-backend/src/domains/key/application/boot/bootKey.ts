import type { Db } from "mongodb";
import type { InMemoryIntentBus } from "@marginal-card/backend-framework";

import { MongoKeyStore } from "../../infra/mongo.key.store";
import { CreateKeyCommandHandler } from "../commands/createKey.command";

export function bootKey(db: Db, intentBus: InMemoryIntentBus) {
  const keyStore = new MongoKeyStore(db);

  intentBus.register(new CreateKeyCommandHandler(keyStore));

  return { keyStore };
}
