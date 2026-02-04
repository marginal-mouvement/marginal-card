import {
  Contract,
  MethodOf,
  PayloadOf,
  ResultOf,
  RouteOf,
} from "@marginal-card/types";
import { Context, Hono } from "hono";
import { Response } from "../response";

export class HonoTypesafeRoutes {
  constructor(private readonly hono: Hono) {}

  register<C extends Contract<any, any, any, any>>(
    method: MethodOf<C>,
    route: RouteOf<C>,
    validate: (ctx: Context) => Promise<PayloadOf<C>>,
    handler: (payload: PayloadOf<C>) => Promise<ResultOf<C>>,
  ) {
    const honoMethod = method === "GET" ? "get" : "post";

    this.hono[honoMethod](route, async (ctx) => {
      const payload = await validate(ctx);
      const result = await handler(payload);
      const response = Response.ok("ok", result);
      ctx.status(response.getStatus() as any);
      return ctx.json(response.serialize());
    });

    return this;
  }
}
