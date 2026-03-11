import { ApplicationError } from "@marginal-card/backend-framework";
import { z } from "zod";

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
