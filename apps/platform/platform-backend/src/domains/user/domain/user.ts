import { EsAggregate, EsEvent, On } from "@ddd-ts/core";
import { UserId } from "@marginal-card/backend-framework";
import { Email } from "./email";
import { Optional } from "@ddd-ts/shape";

export class UserCreated extends EsEvent("UserCreated", {
  id: UserId,
  name: String,
  email: Email,
  referrerId: Optional(UserId),
}) {}

export class User extends EsAggregate("User", {
  events: [UserCreated],
  state: {
    id: UserId,
    name: String,
    email: Email,
    balance: Number,
  },
}) {
  static create(name: string, email: Email, referrerId?: UserId) {
    return this.new(
      UserCreated.new({
        id: UserId.generate(),
        name,
        email,
        referrerId,
      }),
    );
  }

  @On(UserCreated)
  private static onUserCreated(event: UserCreated) {
    return new User({
      id: event.payload.id,
      name: event.payload.name,
      email: event.payload.email,
      balance: 0,
    });
  }
}
