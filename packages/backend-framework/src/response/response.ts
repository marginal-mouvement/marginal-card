import { ErrorCode, OkCode } from "./code";

export class Response<D> {
  constructor(
    private readonly code: OkCode | ErrorCode,
    private readonly message: string,
    private readonly ok: boolean,
    private readonly data?: D,
  ) {}

  static ok<D>(message: string, data?: D) {
    return new Response<D>(OkCode.OK, message, true, data);
  }

  getStatus() {
    return this.code.status;
  }

  serialize() {
    return {
      status: this.code.status,
      code: this.code.code,
      message: this.message,
      ok: this.ok,
      data: this.data,
    };
  }
}
