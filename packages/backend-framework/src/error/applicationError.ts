import { MakeErrorBuilder } from "./exception";
import { Constructor } from "@ddd-ts/types";
import { ErrorCode } from "../response";

export class ApplicationError extends MakeErrorBuilder("Application") {
  static malformed(ressource: string | Constructor, reason: string) {
    const ressourceName =
      typeof ressource === "string" ? ressource : ressource.name;

    return new this.Class(
      ErrorCode.BAD_REQUEST,
      `Malformed: ${ressourceName} ${reason}`,
    );
  }
}
