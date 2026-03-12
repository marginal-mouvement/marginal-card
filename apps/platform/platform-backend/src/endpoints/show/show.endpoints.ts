import type { IntentBus } from "@marginal-card/backend-framework";
import type {
  AllShowsContract,
  CreateShowContract,
} from "@marginal-card/platform-sdk";

import { createShowSchema } from "./show.zodSchemas";

import type { AuthenticateFunction, Endpoints } from "../types";
import { zodParse } from "../zodParse";
import { CreateShowCommand } from "../../domains/show/applicatioin/commands/createShow.command";
import { AllShowsQuery } from "../../domains/show/applicatioin/queries/allShows.query";

export function bootShowEndpoints(
  endpoints: Endpoints,
  authenticate: AuthenticateFunction,
  intentBus: IntentBus,
) {
  endpoints.postWithAuth<CreateShowContract>("/show/create", {
    async validate(ctx) {
      return {
        actor: await authenticate(ctx),
        payload: zodParse(createShowSchema, await ctx.req.json()),
      };
    },
    async handle(payload, actor) {
      const show = await intentBus.handle(
        new CreateShowCommand({
          actor,
          name: payload.name,
          reward: payload.reward,
          date: payload.date,
          thumbnailUrl: payload.thumbnailUrl,
        }),
      );

      return {
        id: show.id.serialize(),
        name: show.name,
        reward: show.reward,
        date: show.date.toISOString(),
        thumbnailUrl: show.thumbnailUrl,
      };
    },
  });

  endpoints.getWithAuth<AllShowsContract>("/show/all", {
    async validate(ctx) {
      return {
        actor: await authenticate(ctx),
        payload: undefined,
      };
    },
    async handle(_, actor) {
      const shows = await intentBus.handle(new AllShowsQuery({ actor }));
      return shows.map((show) => ({
        id: show.id.serialize(),
        name: show.name,
        reward: show.reward,
        date: show.date.toISOString(),
        thumbnailUrl: show.thumbnailUrl,
      }));
    },
  });
}
