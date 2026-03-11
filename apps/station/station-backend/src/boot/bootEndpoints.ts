import { Hono } from "hono";
import type { SubscriptionRegistry } from "@marginal-card/backend-framework";
import {
  HonoTypesafeRoutes,
  KeyId,
  UserId,
} from "@marginal-card/backend-framework";
import type {
  GetReadersContract,
  StationSubscriptionTopics,
  WriteKeyIdContract,
} from "@marginal-card/station-sdk";
import type { PayloadOf } from "@marginal-card/types";

import type { ReaderManager } from "../domains/reader/infra/readerManager";
import { ReaderId } from "../domains/reader/domain/readerId";

export function bootEndpoints(
  readerManager: ReaderManager,
  subscriptionRegistry: SubscriptionRegistry<StationSubscriptionTopics>,
) {
  const hono = new Hono();
  const endpoints = new HonoTypesafeRoutes(hono);

  endpoints.post<WriteKeyIdContract>("/reader/write", {
    async validate(ctx) {
      return { payload: await ctx.req.json<PayloadOf<WriteKeyIdContract>>() };
    },
    async handle({ readerId, keyId }) {
      await readerManager.write(ReaderId.parse(readerId), KeyId.parse(keyId));
    },
  });

  endpoints.get<GetReadersContract>("/reader/list", {
    async validate() {
      return { payload: undefined };
    },
    async handle() {
      return { readers: readerManager.getReaders() };
    },
  });

  endpoints.subscription(
    subscriptionRegistry,
    async () => ({
      actor: { id: UserId.root() },
    }),
    ["reader:*"],
  );

  return hono;
}
