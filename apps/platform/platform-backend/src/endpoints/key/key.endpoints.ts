import type {
  CreateKeyContract,
  IsKeyAvailableContract,
} from "@marginal-card/platform-sdk";
import type { InMemoryIntentBus } from "@marginal-card/backend-framework";
import { KeyId } from "@marginal-card/backend-framework";

import { createKeySchema, isKeyAvailableSchema } from "./key.zodSchemas";

import type { AuthenticateFunction, Endpoints } from "../types";
import { zodParse } from "../zodParse";
import { CreateKeyCommand } from "../../domains/key/application/commands/createKey.command";
import { ShowId } from "../../domains/show/domain/showId";
import { IsKeyAvailableQuery } from "../../domains/key/application/commands/isKeyAvailable.query";

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

  endpoints.post<IsKeyAvailableContract>("/key/available", {
    async validate(ctx) {
      return {
        payload: zodParse(isKeyAvailableSchema, await ctx.req.json()),
      };
    },
    async handle({ keyId }) {
      return intentBus.handle(
        new IsKeyAvailableQuery({ keyId: KeyId.parse(keyId) }),
      );
    },
  });
}
