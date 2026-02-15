import { Primitive } from "@ddd-ts/shape";
import { monotonicFactory } from "ulid";
import { Constructor } from "@ddd-ts/types";
import { ApplicationError } from "../error";

const ulid = monotonicFactory();

export function Id<S extends string>(trigram: S) {
  abstract class Id extends Primitive(String) {
    static short = trigram;

    static generate<T extends Id>(this: Constructor<T>): T {
      return new this(`${trigram}_${ulid()}`);
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
