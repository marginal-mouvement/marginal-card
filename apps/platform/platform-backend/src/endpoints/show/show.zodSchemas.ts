import { z } from "zod";

export const createShowSchema = z.object({
  name: z.string(),
  reward: z.number().positive(),
  date: z.coerce.date(),
  thumbnailUrl: z.url().optional(),
});
