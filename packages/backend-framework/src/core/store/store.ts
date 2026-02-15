import { IIdentifiable } from "@ddd-ts/core";
import { Transaction } from "./transaction";

export interface Store<T extends IIdentifiable> {
  load(id: T["id"], transaction?: Transaction): Promise<T | undefined>;
  save(entity: T, transaction?: Transaction): Promise<void>;
}
