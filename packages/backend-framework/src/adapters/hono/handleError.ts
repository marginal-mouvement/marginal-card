import type { HTTPResponseError } from "hono/types";
import type { Context } from "hono";

import type { Logger } from "../../core";
import { Exception, InfrastructureError } from "../../core";

export function handleError(logger: Logger) {
  return (err: Error | HTTPResponseError, ctx: Context) => {
    logger.error(err);
    if (err instanceof Exception) {
      const response = err.toResponse();
      ctx.status(response.getStatus() as any);
      return ctx.json(response.serialize());
    }

    ctx.status(500);
    return ctx.json(
      InfrastructureError.because("Unexpected internal error")
        .toResponse()
        .serialize(),
    );
  };
}
