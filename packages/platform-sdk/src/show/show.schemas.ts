import { z } from "zod";

export const SimpleShowSchema = z.object({
  id: z.string(),
  name: z.string(),
  reward: z.number().positive(),
  date: z.coerce.date(),
  thumbnailUrl: z.url().optional(),
});
