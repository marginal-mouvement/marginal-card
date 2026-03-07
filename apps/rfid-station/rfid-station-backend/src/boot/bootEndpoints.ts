import { Hono } from "hono";
import type {
  SubscriptionRegistry} from "@marginal-card/backend-framework";
import {
  HonoTypesafeRoutes,
  KeyId,
  UserId,
} from "@marginal-card/backend-framework";
import type {
  RfidStationSubscriptionTopics,
  SetReaderIdleContract,
  WriteKeyIdContract,
} from "@marginal-card/rfid-station-sdk";
import type { PayloadOf } from "@marginal-card/types";

import type { ReaderManager } from "../domains/reader/infra/readerManager";

export function bootEndpoints(
  readerManager: ReaderManager,
  subscriptionRegistry: SubscriptionRegistry<RfidStationSubscriptionTopics>,
) {
  const hono = new Hono();
  const endpoints = new HonoTypesafeRoutes(hono);

  endpoints.post<SetReaderIdleContract>("/reader/idle", {
    async validate(ctx) {
      return {
        payload: await ctx.req.json<PayloadOf<SetReaderIdleContract>>(),
      };
    },
    async handle({ readerName }) {
      readerManager.setIdle(readerName);
    },
  });

  endpoints.post<WriteKeyIdContract>("/reader/write", {
    async validate(ctx) {
      return { payload: await ctx.req.json<PayloadOf<WriteKeyIdContract>>() };
    },
    async handle({ readerName, keyId }) {
      await readerManager.write(readerName, KeyId.parse(keyId));
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
