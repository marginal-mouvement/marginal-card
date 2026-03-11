import type { ISerializer } from "@ddd-ts/core";

import { Show } from "../domain/show";
import { ShowId } from "../domain/showId";

export class MongoShowSerializer implements ISerializer<Show> {
  serialize(value: Show) {
    return {
      version: 1,
      _id: value.id.serialize(),
      name: value.name,
      reward: value.reward,
      date: value.date,
      thumbnailUrl: value.thumbnailUrl,
    };
  }

  deserialize(value: ReturnType<typeof this.serialize>) {
    return new Show({
      id: ShowId.deserialize(value._id),
      name: value.name,
      reward: value.reward,
      date: value.date,
      thumbnailUrl: value.thumbnailUrl,
    });
  }
}
