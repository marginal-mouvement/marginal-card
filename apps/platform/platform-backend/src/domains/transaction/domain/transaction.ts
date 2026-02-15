import { Optional, Shape } from "@ddd-ts/shape";
import { TransactionId } from "./transactionId";

export class Transaction extends Shape({
  id: TransactionId,
  label: String,
  thumbnailUrl: Optional(String),
  amount: Number,
  date: Date,
}) {}
