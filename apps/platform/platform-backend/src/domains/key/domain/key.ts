import { KeyId, UserId } from "@marginal-card/backend-framework";
import { Optional, Shape } from "@ddd-ts/shape";

import { ShowId } from "../../show/domain/showId";

export class Key extends Shape({
  id: KeyId,
  ownerId: Optional(UserId),
  showId: Optional(ShowId),
}) {
  static create() {
    return new Key({
      id: KeyId.generate(),
      ownerId: undefined,
      showId: undefined,
    });
  }

  assign(ownerId: UserId) {
    this.ownerId = ownerId;
  }
}
