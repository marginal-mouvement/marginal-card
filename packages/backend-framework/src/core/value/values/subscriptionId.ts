import { Id } from "../id";
import { UserId } from "./userId";
import { ApplicationError } from "../../error";

class ChannelId extends Id("sub") {}

export type SubscriptionIdString = string & { _type?: "SubscriptionId" };

export class SubscriptionId {
  constructor(
    readonly userId: UserId,
    readonly channelId: ChannelId,
  ) {}

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

  toSubscriptionIdString() {
    return this.serialize() as SubscriptionIdString;
  }

  static parse(serialized: unknown) {
    if (typeof serialized !== "string") {
      throw ApplicationError.malformed(SubscriptionId, "must be a string");
    }

    const [userId, channelId] = serialized.split("@");

    return new SubscriptionId(UserId.parse(userId), ChannelId.parse(channelId));
  }
}
