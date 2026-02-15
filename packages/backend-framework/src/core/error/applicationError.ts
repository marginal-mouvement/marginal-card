import { MakeErrorBuilder } from "./exception";
import { Constructor } from "@ddd-ts/types";
import { ErrorCode } from "../response";

export class ApplicationError extends MakeErrorBuilder("Application") {
  static malformed(resource: string | Constructor, reason: string) {
    const resourceName =
      typeof resource === "string" ? resource : resource.name;

    return new this.Class(
      ErrorCode.BAD_REQUEST,
      `Malformed: ${resourceName} ${reason}`,
    );
  }

  static forbidden(expected: string, received: string) {
    return new this.Class(
      ErrorCode.FORBIDDEN,
      `Forbidden: you need to be at least ${expected}, you are ${received}`,
    );
  }

  static notFound(
    resource: string | Constructor,
    id: string | { serialize(): string },
  ) {
    const identifier = typeof id === "string" ? id : id.serialize();
    const resourceName =
      typeof resource === "string" ? resource : resource.name;

    return new this.Class(
      ErrorCode.NOT_FOUND,
      `${resourceName} ${identifier} not found.`,
    );
  }

  static conflict(reason: string) {
    return new this.Class(ErrorCode.CONFLICT, reason);
  }
}
