import {
  InMemoryDatabase,
  InMemoryStore,
  InMemoryTransaction,
} from "@ddd-ts/store-inmemory";
import { User } from "../domain/user";
import { UserSerializer } from "./user.serializer";
import { UserStore } from "../application/user.store";
import { DispatchingStore } from "@marginal-card/backend-framework";

export class InMemoryUserStore
  extends DispatchingStore(InMemoryStore<User>)
  implements UserStore
{
  constructor(db: InMemoryDatabase) {
    super("user", db, new UserSerializer());
  }

  async loadByName(name: string, transaction?: InMemoryTransaction) {
    return (await this.filter((user) => user.name === name, transaction))[0];
  }
}
