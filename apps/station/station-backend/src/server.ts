import { Hono } from "hono";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";

import { HELLO } from "./hello";
import { bootEndpoints } from "./boot/bootEndpoints";
import { globalBoot } from "./boot/globalBoot";

console.log(HELLO);

const { readerManager, subscriptionRegistry } = globalBoot();

const hono = new Hono();
hono.use(logger());

hono.route("/api", bootEndpoints(readerManager, subscriptionRegistry));

serve(
  {
    fetch: hono.fetch,
    hostname: "127.0.0.1",
    port: 4444,
  },
  console.log,
);
