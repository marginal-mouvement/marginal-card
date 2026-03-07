import type {
  Contract,
  HandshakeSubscriptionEvent,
  PayloadOf,
  ResultOf,
  RouteOf,
  SubscriptionEvent,
} from "@marginal-card/types";
import type { Context, Hono } from "hono";
import { streamSSE } from "hono/streaming";

import type {
  SubscriptionRegistry,
  UserId} from "../../core";
import {
  Response,
  SubscriptionId
} from "../../core";

interface Actor {
  id: UserId;
}

type ValidationCallback<C extends Contract<any, any, any, any>> = (
  ctx: Context,
) => Promise<{ payload: PayloadOf<C> }>;

type ValidationCallbackWithAuth<
  C extends Contract<any, any, any, any>,
  A extends Actor,
> = (ctx: Context) => Promise<{ actor: A; payload: PayloadOf<C> }>;

type HandlerCallback<C extends Contract<any, any, any, any>> = (
  payload: PayloadOf<C>,
) => Promise<ResultOf<C>>;

type HandlerCallbackWithAuth<
  C extends Contract<any, any, any, any>,
  A extends Actor,
> = (payload: PayloadOf<C>, actor: A) => Promise<ResultOf<C>>;

export class HonoTypesafeRoutes<ActorClass extends Actor = Actor> {
  constructor(private readonly hono: Hono) {}

  private registerHandler<C extends Contract<any, any, any, any>>(
    method: "get" | "post",
    route: RouteOf<C>,
    validate: (
      ctx: Context,
    ) => Promise<{ actor?: ActorClass; payload: PayloadOf<C> }>,
    handler: (
      payload: PayloadOf<C>,
      actor?: ActorClass,
    ) => Promise<ResultOf<C>>,
  ) {
    this.hono[method](route, async (ctx) => {
      const { actor, payload } = await validate(ctx);
      const result = await handler(payload, actor);
      const response = Response.ok("ok", result);
      ctx.status(response.getStatus() as any);
      return ctx.json(response.serialize());
    });
  }

  post<C extends Contract<any, "POST", any, any>>(
    route: RouteOf<C>,
    config: {
      validate: ValidationCallback<C>;
      handle: HandlerCallback<C>;
    },
  ) {
    this.registerHandler("post", route, config.validate, config.handle);
  }

  postWithAuth<C extends Contract<any, "POST", any, any>>(
    route: RouteOf<C>,
    config: {
      validate: ValidationCallbackWithAuth<C, ActorClass>;
      handle: HandlerCallbackWithAuth<C, ActorClass>;
    },
  ) {
    this.registerHandler("post", route, config.validate, config.handle as any);
  }

  get<C extends Contract<any, "GET", any, any>>(
    route: RouteOf<C>,
    config: {
      validate: ValidationCallback<C>;
      handle: HandlerCallback<C>;
    },
  ) {
    this.registerHandler("get", route, config.validate, config.handle);
  }

  getWithAuth<C extends Contract<any, "GET", any, any>>(
    route: RouteOf<C>,
    config: {
      validate: ValidationCallbackWithAuth<C, ActorClass>;
      handle: HandlerCallbackWithAuth<C, ActorClass>;
    },
  ) {
    this.registerHandler("get", route, config.validate, config.handle as any);
  }

  subscription<T extends { [key: string]: SubscriptionEvent<any, any> }>(
    registry: SubscriptionRegistry<T>,
    validate: (ctx: Context) => Promise<{ actor: ActorClass }>,
    defaultTopics?: Array<keyof T>,
  ) {
    this.hono.get("/events", async (context) => {
      const { actor } = await validate(context);
      return streamSSE(context, async (stream) => {
        const onHandled = async (event: any) =>
          await stream.writeSSE({
            data: JSON.stringify(event),
          });

        const subscriptionId = SubscriptionId.for(actor.id);

        await stream.writeSSE({
          data: JSON.stringify({
            name: "Handshake",
            at: new Date(),
            payload: {
              subscriptionId: subscriptionId.serialize(),
            },
          } satisfies HandshakeSubscriptionEvent),
        });

        registry.registerHandler(subscriptionId, onHandled);

        if (defaultTopics) {
          for (const topic of defaultTopics) {
            registry.subscribe(topic, subscriptionId);
          }
        }

        return new Promise((resolve) => {
          stream.onAbort(() => {
            registry.unregisterHandler(subscriptionId);
            resolve();
          });
        });
      });
    });
  }
}
