import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { logger } from "hono/logger";

import { globalBoot } from "./boot/globalBoot";
import { bootEndpoints } from "./boot/bootEndpoints";

const app = new Hono();

app.use(logger());

const { intentBus, authenticator } = globalBoot();

app.route("/api", bootEndpoints(authenticator, intentBus));

serve(
  {
    fetch: app.fetch,
    port: 4445,
  },
  console.log,
);
