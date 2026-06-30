import { z } from "zod";

export const SimpleTransferSchema = z.object({
  id: z.string(),
  userId: z.string(),
  amount: z.number().positive(),
  label: z.string(),
  thumbnailUrl: z.url().optional(),
  kind: z.enum(["credit", "debit"]),
  date: z.coerce.date(),
});
