import type { InMemoryIntentBus } from "@marginal-card/backend-framework";
import { HonoTypesafeRoutes } from "@marginal-card/backend-framework";
import { type Context, Hono } from "hono";

import { bootKeyEndpoints } from "./key/key.endpoints";
import { bootUserEndpoints } from "./user/user.endpoints";
import { bootShowEndpoints } from "./show/show.endpoints";
import { bootTransferEndpoints } from "./transfer/transfer.endpoints";

import type { Authenticator } from "../domains/auth/application/authenticator";
import type { Actor } from "../domains/auth/domain/actor";
import { HonoRequestContext } from "../domains/auth/infra/hono.requestContext";

export function bootEndpoints(
  authenticator: Authenticator,
  intentBus: InMemoryIntentBus,
) {
  const hono = new Hono();
  const endpoints = new HonoTypesafeRoutes<Actor>(hono);

  function authenticate(ctx: Context) {
    const requestContext = new HonoRequestContext(ctx);
    return authenticator.authenticate(requestContext);
  }

  bootKeyEndpoints(endpoints, authenticate, intentBus);

  bootUserEndpoints(endpoints, authenticate, intentBus);

  bootShowEndpoints(endpoints, authenticate, intentBus);

  bootTransferEndpoints(endpoints, authenticate, intentBus);

  return hono;
}
