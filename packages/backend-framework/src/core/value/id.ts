import { Primitive } from "@ddd-ts/shape";
import { monotonicFactory } from "ulid";
import type { Constructor } from "@ddd-ts/types";

import { randomBytes } from "crypto";

import { ApplicationError } from "../error";

const ulidFactory = monotonicFactory();

const randomFactory = () => randomBytes(19).toString("base64url");

export function Id<const S extends string>(
  trigram: S,
  { implementation = "ulid" }: { implementation?: "ulid" | "random" } = {},
) {
  abstract class Id extends Primitive(String) {
    static short = trigram;
    _short = trigram;

    static generate<T extends Id>(this: Constructor<T>): T {
      return new this(
        `${trigram}_${implementation === "random" ? randomFactory() : ulidFactory()}`,
      );
    }

    equals(other: Id) {
      return other.value === this.value;
    }

    static parse<T extends Id>(this: Constructor<T>, candidate: unknown) {
      if (typeof candidate !== "string") {
        throw ApplicationError.malformed(this.name, "must be a string");
      }

      if (!candidate.startsWith(`${trigram}_`)) {
        throw ApplicationError.malformed(
          this.name,
          `must start with ${trigram}_`,
        );
      }

      return new this(candidate);
    }
  }

  return Id;
}
