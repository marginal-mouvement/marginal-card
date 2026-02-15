import { KeyId } from "./keyId";
import { UserId } from "@marginal-card/backend-framework";
import { Optional, Shape } from "@ddd-ts/shape";

export class Key extends Shape({
  id: KeyId,
  ownerId: Optional(UserId),
}) {
  static create() {
    return new Key({
      id: KeyId.generate(),
      ownerId: undefined,
    });
  }

  assign(ownerId: UserId) {
    this.ownerId = ownerId;
  }
}
