import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";
import {
  Environment,
  Exception,
  InfrastructureError,
  Logger,
} from "@marginal-card/backend-framework";
import { cors } from "hono/cors";

import { globalBoot } from "./boot/globalBoot";
import { bootEndpoints } from "./endpoints/bootEndpoints";

const app = new Hono();

app.use(logger());
app.use(cors());

const oops = Logger.for("Server");

const { intentBus, authenticator } = globalBoot();

app.route("/api", bootEndpoints(authenticator, intentBus));

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

serve(
  {
    fetch: app.fetch,
    port: Number.parseInt(Environment.get("PORT"), 10),
  },
  console.log,
);
