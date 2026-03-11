import type { Contract } from "@marginal-card/types";

import type { SimpleShow } from "./show.shapes";

export type CreateShowContract = Contract<
  "/show/create",
  "POST",
  {
    name: string;
    thumbnailUrl?: string;
    date: Date;
    reward: number;
  },
  SimpleShow
>;

export type AllShowsContract = Contract<
  "/show/all",
  "GET",
  undefined,
  SimpleShow[]
>;
