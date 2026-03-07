import type { Contract } from "@marginal-card/types";

export type CreateKeyContract = Contract<
  "/key/create",
  "POST",
  undefined,
  { keyId: string }
>;

export type ClaimKeyContract = Contract<
  "/key/claim",
  "POST",
  {
    email: string;
    name: string;
    keyId: string;
    refererName?: string;
  },
  undefined
>;

// export type CreditPointsContract = Contract<
//   "/points/credit",
//   "POST",
//   {
//     intentId: string;
//     userId: string;
//     amount: number;
//     reason: {
//       description: string;
//       thumbnail?: string;
//     };
//   },
//   undefined
// >;
//
// export type DebitPointsContract = Contract<
//   "/points/debit",
//   "POST",
//   {
//     intentId: string;
//     userId: string;
//     amount: number;
//     reason: {
//       description: string;
//       thumbnail?: string;
//     };
//   },
//   undefined
// >;
