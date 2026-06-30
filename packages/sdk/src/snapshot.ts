import { z } from "zod";

export function Snapshot<const T extends string, const U extends z.ZodRawShape>(
  name: T,
  payload: U,
) {
  return z.object({
    name: z.literal(name),
    payload: z.object(payload),
    at: z.coerce.date(),
  });
}

export function Snapshots<
  T extends [
    z.ZodObject<{ name: z.ZodLiteral<string> }>,
    ...z.ZodObject<{ name: z.ZodLiteral<string> }>[],
  ],
>(...snapshots: T) {
  return z.discriminatedUnion("name", snapshots);
}

export const HandshakeSnapshot = Snapshot("Handshake", {});

export type AnySnapshot = z.infer<ReturnType<typeof Snapshot>>;

export type Topics<T extends AnySnapshot, U extends Record<keyof U, T>> = U;
