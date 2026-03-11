import type { Contract } from "@marginal-card/types";

export type WriteKeyIdContract = Contract<
  "/reader/write",
  "POST",
  { keyId: string; readerId: string },
  undefined
>;

export type GetReadersContract = Contract<
  "/reader/list",
  "GET",
  undefined,
  { readers: Array<{ id: string; name: string }> }
>;
