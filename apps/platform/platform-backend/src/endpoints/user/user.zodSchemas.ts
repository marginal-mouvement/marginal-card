import { UserRegex } from "@marginal-card/platform-sdk";
import { z } from "zod";

const username = z
  .string()
  .min(4)
  .max(20)
  .toLowerCase()
  .regex(UserRegex.USERNAME);

export const claimKeySchema = z.object({
  email: z.email(),
  name: username,
  keyId: z.string(),
  refererName: username.optional(),
});
