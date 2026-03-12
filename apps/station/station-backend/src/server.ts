import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import {
  Exception,
  InfrastructureError,
  Logger,
} from "@marginal-card/backend-framework";

import { HELLO } from "./hello";
import { bootEndpoints } from "./boot/bootEndpoints";
import { globalBoot } from "./boot/globalBoot";

console.log(HELLO);

const { readerManager, subscriptionRegistry } = globalBoot();

const app = new Hono();

app.use(logger());

const oops = Logger.for("Server");

app.onError((err, ctx) => {
  oops.error(err);
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
});

app.route("/api", bootEndpoints(readerManager, subscriptionRegistry));

serve(
  {
    fetch: app.fetch,
    hostname: "127.0.0.1",
    port: 4444,
  },
  console.log,
);
