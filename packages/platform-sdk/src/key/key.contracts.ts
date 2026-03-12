import type { Contract } from "@marginal-card/types";

export type CreateKeyContract = Contract<
  "/key/create",
  "POST",
  { showId?: string },
  { keyId: string }
>;

export type IsKeyAvailableContract = Contract<
  "/key/available",
  "POST",
  { keyId: string },
  { available: boolean }
>;
