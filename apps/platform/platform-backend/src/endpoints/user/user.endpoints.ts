import type { InMemoryIntentBus } from "@marginal-card/backend-framework";
import { KeyId } from "@marginal-card/backend-framework";
import type { ClaimKeyContract, MeContract } from "@marginal-card/platform-sdk";

import { claimKeySchema } from "./user.zodSchemas";

import type { AuthenticateFunction, Endpoints } from "../types";
import { ClaimKeyCommand } from "../../domains/user/application/commands/claimKey.command";
import { Email } from "../../domains/user/domain/email";
import { zodParse } from "../zodParse";
import { MeQuery } from "../../domains/user/application/queries/me.query";

export function bootUserEndpoints(
  endpoints: Endpoints,
  intentBus: InMemoryIntentBus,
  authenticate: AuthenticateFunction,
) {
  endpoints.post<ClaimKeyContract>("/user/claim-key", {
    async validate(ctx) {
      return {
        payload: zodParse(claimKeySchema, await ctx.req.json()),
      };
    },
    async handle({ keyId, email, refererName, name }) {
      const user = await intentBus.handle(
        new ClaimKeyCommand({
          keyId: KeyId.parse(keyId),
          email: Email.deserialize(email),
          refererName,
          name,
        }),
      );

      return {
        id: user.id.serialize(),
        name: user.name,
        email: user.email.serialize(),
        balance: user.balance,
        visitedShows: user.visitedShows.map((show) => show.serialize()),
        emailConfirmed: user.emailConfirmed,
      };
    },
  });

  endpoints.getWithAuth<MeContract>("/user/me", {
    validate: async (ctx) => ({
      payload: undefined,
      actor: await authenticate(ctx),
    }),
    async handle(_, actor) {
      const user = await intentBus.handle(new MeQuery({ actor }));

      return {
        id: user.id.serialize(),
        name: user.name,
        email: user.email.serialize(),
        balance: user.balance,
        visitedShows: user.visitedShows.map((show) => show.serialize()),
        emailConfirmed: user.emailConfirmed,
      };
    },
  });
}
