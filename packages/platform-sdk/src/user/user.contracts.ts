import type { Contract } from "@marginal-card/types";

import type { SimpleUser } from "./user.shapes";

export type ClaimKeyContract = Contract<
  "/user/claim-key",
  "POST",
  {
    email: string;
    name: string;
    keyId: string;
    refererName?: string;
  },
  SimpleUser
>;

export type MeContract = Contract<"/user/me", "GET", undefined, SimpleUser>;

export type UserByKeyContract = Contract<
  "/user/by-key",
  "POST",
  {
    keyId: string;
  },
  SimpleUser
>;

export type CreditUserContract = Contract<
  "/user/credit",
  "POST",
  {
    userId: string;
    amount: number;
    label: string;
    thumbnailUrl?: string;
  },
  undefined
>;

export type DebitUserContract = Contract<
  "/user/debit",
  "POST",
  {
    userId: string;
    amount: number;
    label: string;
    thumbnailUrl?: string;
  },
  undefined
>;
