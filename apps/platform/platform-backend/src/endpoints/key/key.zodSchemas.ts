import { z } from "zod";

export const createKeySchema = z.object({
  showId: z.string().optional(),
});
