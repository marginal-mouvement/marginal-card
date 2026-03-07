import type { InMemoryIntentBus } from "@marginal-card/backend-framework";
import { HonoTypesafeRoutes, KeyId } from "@marginal-card/backend-framework";
import { type Context, Hono } from "hono";
import type {
  ClaimKeyContract,
  CreateKeyContract,
} from "@marginal-card/platform-sdk";

import { claimKeySchema, zodParse } from "./zodSchemas";

import type { Authenticator } from "../domains/auth/application/authenticator";
import type { Actor } from "../domains/auth/domain/actor";
import { HonoRequestContext } from "../domains/auth/infra/hono.requestContext";
import { CreateKeyCommand } from "../domains/key/application/commands/createKey.command";
import { ClaimKeyCommand } from "../domains/user/application/commands/claimKey.command";
import { Email } from "../domains/user/domain/email";

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

  endpoints.postWithAuth<CreateKeyContract>("/key/create", {
    async validate(ctx) {
      return {
        payload: undefined,
        actor: await authenticate(ctx),
      };
    },
    async handle(_, actor) {
      const res = await intentBus.handle(
        new CreateKeyCommand({
          actor,
        }),
      );

      return {
        keyId: res.id.serialize(),
      };
    },
  });

  endpoints.post<ClaimKeyContract>("/key/claim", {
    async validate(ctx) {
      return {
        payload: zodParse(claimKeySchema, await ctx.req.json()),
      };
    },
    async handle({ keyId, email, refererName, name }) {
      await intentBus.handle(
        new ClaimKeyCommand({
          keyId: KeyId.parse(keyId),
          email: Email.deserialize(email),
          refererName,
          name,
        }),
      );
    },
  });

  return hono;
}
