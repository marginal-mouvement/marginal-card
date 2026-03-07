import type { ISerializer } from "@ddd-ts/core";
import { UserId } from "@marginal-card/backend-framework";

import { User } from "../domain/user";
import { Email } from "../domain/email";

export class MongoUserSerializer implements ISerializer<User> {
  serialize(value: User) {
    return {
      version: 1,
      _id: value.id.serialize(),
      name: value.name,
      email: value.email.serialize(),
      balance: value.balance,
    };
  }

  deserialize(value: ReturnType<typeof this.serialize>) {
    return new User({
      id: UserId.deserialize(value._id),
      name: value.name,
      email: Email.deserialize(value.email),
      balance: value.balance,
    });
  }
}
