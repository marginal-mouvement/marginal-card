import { UserId } from "@marginal-card/backend-framework";
import { Permission } from "./grade";

export class Actor {
  constructor(
    readonly userId: UserId,
    readonly permission: Permission,
  ) {}

  ensureIsAtLeastStation() {
    this.permission.ensureIsAtLeast(Permission.station());
  }

  static root() {
    return new Actor(UserId.root(), Permission.root());
  }

  static generate(permission: Permission) {
    return new Actor(UserId.generate(), permission);
  }
}
