import { Contract, PayloadOf, ResultOf, RouteOf } from "@marginal-card/types";
import { Context, Hono } from "hono";
import { Response } from "../../core";

export class HonoTypesafeRoutes<ActorClass> {
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
    validate: (ctx: Context) => Promise<PayloadOf<C>>,
    handler: (payload: PayloadOf<C>) => Promise<ResultOf<C>>,
  ) {
    this.registerHandler("post", route, validate, handler);
    return this;
  }

  get<C extends Contract<any, "GET", any, any>>(
    route: RouteOf<C>,
    validate: (
      ctx: Context,
    ) => Promise<{ actor?: ActorClass; payload: PayloadOf<C> }>,
    handler: (
      payload: PayloadOf<C>,
      actor?: ActorClass,
    ) => Promise<ResultOf<C>>,
  ) {
    this.registerHandler("get", route, validate, handler);
  }
}
