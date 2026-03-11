import type { CreateKeyContract } from "@marginal-card/platform-sdk";
import type { InMemoryIntentBus } from "@marginal-card/backend-framework";

import { createKeySchema } from "./key.zodSchemas";

import type { AuthenticateFunction, Endpoints } from "../types";
import { zodParse } from "../zodParse";
import { CreateKeyCommand } from "../../domains/key/application/commands/createKey.command";
import { ShowId } from "../../domains/show/domain/showId";

export function bootKeyEndpoints(
  endpoints: Endpoints,
  authenticate: AuthenticateFunction,
  intentBus: InMemoryIntentBus,
) {
  endpoints.postWithAuth<CreateKeyContract>("/key/create", {
    async validate(ctx) {
      return {
        payload: zodParse(createKeySchema, await ctx.req.json()),
        actor: await authenticate(ctx),
      };
    },
    async handle({ showId }, actor) {
      const res = await intentBus.handle(
        new CreateKeyCommand({
          actor,
          showId: showId ? ShowId.parse(showId) : undefined,
        }),
      );

      return {
        keyId: res.id.serialize(),
      };
    },
  });
}
