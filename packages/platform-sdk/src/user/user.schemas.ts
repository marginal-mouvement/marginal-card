import { z } from "zod";

import { UserRegex } from "./user.regex";

export const UsernameSchema = z
  .string()
  .min(4)
  .max(20)
  .toLowerCase()
  .regex(UserRegex.USERNAME);

export const SimpleUserSchema = z.object({
  id: z.string(),
  name: UsernameSchema,
  email: z.email(),
  balance: z.number().positive(),
  visitedShows: z.array(z.string()),
  emailConfirmed: z.boolean(),
});

export const TransferIntentSchema = z.object({
  userId: z.string(),
  amount: z.number().positive(),
  label: z.string(),
  thumbnailUrl: z.url().optional(),
});
