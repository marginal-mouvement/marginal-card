import type { Contract } from "@marginal-card/types";

export type SetReaderIdleContract = Contract<
  "/reader/idle",
  "POST",
  {
    readerName: string;
  },
  undefined
>;

export type WriteKeyIdContract = Contract<
  "/reader/write",
  "POST",
  { keyId: string; readerName: string },
  undefined
>;
