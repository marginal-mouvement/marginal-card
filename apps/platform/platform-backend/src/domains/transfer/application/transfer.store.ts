import type { Store, UserId } from "@marginal-card/backend-framework";

import type { Transfer } from "../domain/transfer";

export interface TransferStore extends Store<Transfer> {
  loadAllForUser(userId: UserId): Promise<Transfer[]>;
}
