import { z } from "zod";

export const createKeySchema = z.object({
  showId: z.string().optional(),
});

export const isKeyAvailableSchema = z.object({
  keyId: z.string(),
});
