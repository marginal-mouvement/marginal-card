import type { HonoTypesafeRoutes } from "@marginal-card/backend-framework";
import type { Context } from "hono";

import type { Actor } from "../domains/auth/domain/actor";

export type Endpoints = HonoTypesafeRoutes<Actor>;

export type AuthenticateFunction = (ctx: Context) => Promise<Actor>;
