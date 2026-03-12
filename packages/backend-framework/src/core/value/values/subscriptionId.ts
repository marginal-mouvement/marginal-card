import { UserId } from "./userId";

import { Id } from "../id";
import { ApplicationError } from "../../error";

export class ChannelId extends Id("cha") {}

export class SubscriptionId {
  constructor(
    readonly userId: UserId,
    readonly channelId: ChannelId,
  ) {}

  ensureIsForUser(userId: UserId) {
    if (!this.userId.equals(userId)) {
      throw ApplicationError.unauthorized("User ID mismatch");
    }
  }

  static for(userId: UserId) {
    return new SubscriptionId(userId, ChannelId.generate());
  }

  serialize() {
    return `${this.userId.value}@${this.channelId.value}`;
  }

  static deserialize(serialized: string) {
    const [userId, channelId] = serialized.split("@");
    return new SubscriptionId(UserId.parse(userId), ChannelId.parse(channelId));
  }

  static parse(serialized: unknown) {
    if (typeof serialized !== "string") {
      throw ApplicationError.malformed(SubscriptionId, "must be a string");
    }

    const [userId, channelId] = serialized.split("@");

    return new SubscriptionId(UserId.parse(userId), ChannelId.parse(channelId));
  }
}
