import { MongoStore } from "@marginal-card/backend-framework";
import type { Db } from "mongodb";

import { MongoTransferSerializer } from "./mongo.transfer.serializer";

import type { Transfer } from "../domain/transfer";

export class MongoTransferStore extends MongoStore<Transfer> {
  constructor(db: Db) {
    super(db, "transfer", new MongoTransferSerializer());
  }
}

