import { Contract } from "@marginal-card/sdk";
import { z } from "zod";

export const SubscriptionApi = {
  Create: Contract.forReturningCommand({
    path: "/subscription/create",
    withAuth: false,
    bodySchema: z.object({}),
    outputSchema: z.object({
      subscriptionId: z.string(),
    }),
  }),
} as const;
