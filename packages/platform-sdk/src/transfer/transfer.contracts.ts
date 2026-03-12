import type { Contract } from "@marginal-card/types";

import type { SimpleTransfer } from "./transfer.shapes";

export type AllMyTransfersContract = Contract<
  "/transfer/my",
  "GET",
  undefined,
  {
    transfers: SimpleTransfer[];
  }
>;
