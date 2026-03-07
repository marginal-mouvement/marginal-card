import { type ErrorCode, Response } from "../response";

type ExceptionSource = "Domain" | "Infrastructure" | "Application";

export abstract class Exception<T extends ExceptionSource> extends Error {
  abstract readonly source: T;

  constructor(
    readonly code: ErrorCode,
    readonly message: string,
    readonly cause?: any,
    readonly internalData?: Record<string, any>,
  ) {
    super(message, { cause });
  }

  toResponse() {
    return new Response(this.code, this.message, false);
  }
}

export function MakeErrorBuilder<K extends ExceptionSource>(source: K) {
  return class {
    static Class = class extends Exception<K> {
      readonly source = source;
    };

    static Build(code: ErrorCode) {
      return class extends this.Class {
        constructor(
          message: string,
          cause?: Error,
          internalData?: Record<string, any>,
        ) {
          super(code, message, cause, internalData);
        }
      };
    }
  };
}
