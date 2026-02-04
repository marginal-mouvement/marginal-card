import { Contract } from "@marginal-card/types";

export type CreateUserContract = Contract<
  "/users/create",
  "POST",
  undefined,
  { userId: string }
>;

export type CreditPointsContract = Contract<
  "/points/credit",
  "POST",
  {
    intentId: string;
    userId: string;
    amount: number;
    reason: {
      description: string;
      thumbnail?: string;
    };
  },
  undefined
>;

export type DebitPointsContract = Contract<
  "/points/debit",
  "POST",
  {
    intentId: string;
    userId: string;
    amount: number;
    reason: {
      description: string;
      thumbnail?: string;
    };
  },
  undefined
>;
