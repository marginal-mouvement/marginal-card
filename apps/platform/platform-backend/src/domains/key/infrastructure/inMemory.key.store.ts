import { InMemoryDatabase, InMemoryStore } from "@ddd-ts/store-inmemory";
import { Key } from "../domain/key";
import { KeySerializer } from "./key.serializer";
import { KeyStore } from "../application/key.store";

export class InMemoryKeyStore extends InMemoryStore<Key> implements KeyStore {
  constructor(db: InMemoryDatabase) {
    super("key", db, new KeySerializer());
  }
}
