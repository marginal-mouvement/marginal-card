import { Optional, Shape } from "@ddd-ts/shape";

import { TransferId } from "./transferId";

export class Transfer extends Shape({
  id: TransferId,
  label: String,
  thumbnailUrl: Optional(String),
  amount: Number,
  date: Date,
}) {}
