import { Store, Transaction } from "@marginal-card/backend-framework";
import { User } from "../domain/user";

export interface UserStore extends Store<User> {
  loadByName(
    name: string,
    transaction?: Transaction,
  ): Promise<User | undefined>;
}
