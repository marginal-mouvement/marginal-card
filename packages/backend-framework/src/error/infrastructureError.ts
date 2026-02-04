import { MakeErrorBuilder } from "./exception";
import { ErrorCode } from "../response";

export class InfrastructureError extends MakeErrorBuilder("Infrastructure") {
  static because(message: string, cause?: any) {
    return new this.Class(ErrorCode.INTERNAL, message, cause);
  }
}
