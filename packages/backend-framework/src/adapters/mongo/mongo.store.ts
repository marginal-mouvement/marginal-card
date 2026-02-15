import { IIdentifiable } from "@ddd-ts/core";
import { Serializer, Store } from "../../core";
import { Db } from "mongodb";
import { MongoTransaction } from "./mongo.transaction";

export class MongoStore<T extends IIdentifiable> implements Store<T> {
  constructor(
    private readonly db: Db,
    private readonly collectionName: string,
    private readonly serializer: Serializer<T>,
  ) {}

  get collection() {
    return this.db.collection(this.collectionName);
  }

  async load(id: T["id"], transaction?: MongoTransaction) {
    const doc = this.collection.findOne(
      { id: id.serialize() },
      { session: transaction?.session },
    );

    return doc ? this.serializer.deserialize(doc) : undefined;
  }

  async save(entity: T, transaction?: MongoTransaction) {
    await this.collection.updateOne(
      {
        id: entity.id,
      },
      {
        $set: this.serializer.serialize(entity),
      },
      { upsert: true, session: transaction?.session },
    );
  }
}
