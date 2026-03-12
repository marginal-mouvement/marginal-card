import type { IntentBus } from "@marginal-card/backend-framework";
import type { AllMyTransfersContract } from "@marginal-card/platform-sdk";

import type { AuthenticateFunction, Endpoints } from "../types";
import { AllMyTransfersQuery } from "../../domains/transfer/application/queries/allMyTransfers.query";

export function bootTransferEndpoints(
  endpoints: Endpoints,
  authenticate: AuthenticateFunction,
  intentBus: IntentBus,
) {
  endpoints.getWithAuth<AllMyTransfersContract>("/transfer/my", {
    validate: async (ctx) => ({
      actor: await authenticate(ctx),
      payload: undefined,
    }),
    async handle(_, actor) {
      const transfers = await intentBus.handle(
        new AllMyTransfersQuery({ actor }),
      );
      return {
        transfers: transfers.map((transfer) => ({
          id: transfer.id.serialize(),
          userId: transfer.userId.serialize(),
          label: transfer.label,
          thumbnailUrl: transfer.thumbnailUrl,
          amount: transfer.amount,
          kind: transfer.kind,
          date: transfer.date,
        })),
      };
    },
  });
}
