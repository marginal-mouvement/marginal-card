import type { InMemoryIntentBus } from "@marginal-card/backend-framework";
import { UserId, KeyId } from "@marginal-card/backend-framework";
import type {
  ClaimKeyContract,
  CreditUserContract,
  DebitUserContract,
  MeContract,
  UserByKeyContract,
} from "@marginal-card/platform-sdk";

import {
  claimKeySchema,
  transactionSchema,
  userByKeySchema,
} from "./user.zodSchemas";

import type { AuthenticateFunction, Endpoints } from "../types";
import { ClaimKeyCommand } from "../../domains/user/application/commands/claimKey.command";
import { Email } from "../../domains/user/domain/email";
import { zodParse } from "../zodParse";
import { MeQuery } from "../../domains/user/application/queries/me.query";
import { UserByKeyQuery } from "../../domains/user/application/queries/userByKey.query";
import { CreditUserBalanceCommand } from "../../domains/user/application/commands/creditUserBalance.command";
import { DebitUserBalanceCommand } from "../../domains/user/application/commands/debitUserBalance.command";

export function bootUserEndpoints(
  endpoints: Endpoints,
  authenticate: AuthenticateFunction,
  intentBus: InMemoryIntentBus,
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

  endpoints.postWithAuth<UserByKeyContract>("/user/by-key", {
    async validate(ctx) {
      return {
        actor: await authenticate(ctx),
        payload: zodParse(userByKeySchema, await ctx.req.json()),
      };
    },

    async handle({ keyId }, actor) {
      const user = await intentBus.handle(
        new UserByKeyQuery({ actor, keyId: KeyId.parse(keyId) }),
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

  endpoints.postWithAuth<CreditUserContract>("/user/credit", {
    async validate(ctx) {
      return {
        actor: await authenticate(ctx),
        payload: zodParse(transactionSchema, await ctx.req.json()),
      };
    },
    async handle({ userId, amount, thumbnailUrl, label }, actor) {
      await intentBus.handle(
        new CreditUserBalanceCommand({
          actor,
          userId: UserId.parse(userId),
          amount: amount,
          transfer: {
            thumbnailUrl: thumbnailUrl,
            label: label,
          },
        }),
      );
    },
  });

  endpoints.postWithAuth<DebitUserContract>("/user/debit", {
    async validate(ctx) {
      return {
        actor: await authenticate(ctx),
        payload: zodParse(transactionSchema, await ctx.req.json()),
      };
    },
    async handle({ userId, amount, thumbnailUrl, label }, actor) {
      await intentBus.handle(
        new DebitUserBalanceCommand({
          actor,
          userId: UserId.parse(userId),
          amount: amount,
          transfer: {
            thumbnailUrl: thumbnailUrl,
            label: label,
          },
        }),
      );
    },
  });
}
