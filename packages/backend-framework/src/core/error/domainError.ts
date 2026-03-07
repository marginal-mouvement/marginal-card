import type { Constructor } from "@ddd-ts/types";

import { MakeErrorBuilder } from "./exception";

import { ErrorCode } from "../response";

export class DomainError extends MakeErrorBuilder("Domain") {
  static malformed(resource: string | Constructor, reason: string) {
    const resourceName =
      typeof resource === "string" ? resource : resource.name;

    return new this.Class(
      ErrorCode.BAD_REQUEST,
      `Malformed: ${resourceName} ${reason}`,
    );
  }

  static forbidden(beacause: string) {
    return new this.Class(ErrorCode.FORBIDDEN, `Forbidden: ${beacause}`);
  }
}
