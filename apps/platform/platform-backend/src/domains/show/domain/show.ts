import { Optional, Shape } from "@ddd-ts/shape";

import { ShowId } from "./showId";

export class Show extends Shape({
  id: ShowId,
  name: String,
  reward: Number,
  date: Date,
  thumbnailUrl: Optional(String),
}) {
  static create({
    name,
    reward,
    date,
    thumbnailUrl,
  }: {
    name: string;
    reward: number;
    date: Date;
    thumbnailUrl?: string;
  }) {
    return new Show({
      id: ShowId.generate(),
      name,
      reward,
      date,
      thumbnailUrl,
    });
  }
}
