import * as z from "zod";
import { Regex } from "@marginal-card/platform-sdk";
import { ApplicationError } from "@marginal-card/backend-framework";

export function zodParse<T extends z.ZodObject>(schema: T, candidate: unknown) {
  try {
    return schema.parse(candidate);
  } catch (e) {
    const invalidKey =
      (e instanceof z.ZodError
        ? e.issues[0]?.path?.[0]?.toString()
        : undefined) ?? "unknown";
    const message =
      (e instanceof z.ZodError ? e.issues[0]?.message : undefined) ?? "unknown";
    throw ApplicationError.malformed(invalidKey, message);
  }
}

const username = z.string().min(4).max(20).toLowerCase().regex(Regex.USERNAME);

export const claimKeySchema = z.object({
  email: z.email(),
  name: username,
  keyId: z.string(),
  refererName: username.optional(),
});
