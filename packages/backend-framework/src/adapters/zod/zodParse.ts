import { z } from "zod";

import { ApplicationError } from "../../core";

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
