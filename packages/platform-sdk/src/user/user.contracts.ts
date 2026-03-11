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
