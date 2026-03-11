import type { IntentBus } from "@marginal-card/backend-framework";
import { ApplicationError, Saga } from "@marginal-card/backend-framework";

import { CreditUserBalanceCommand } from "./commands/creditUserBalance.command";

import { UserCreated } from "../domain/user";
import { Actor } from "../../auth/domain/actor";
import type { ShowStore } from "../../show/applicatioin/show.store";
import { Show } from "../../show/domain/show";

export class UserSaga extends Saga {
  constructor(
    private readonly intentBus: IntentBus,
    private readonly showStore: ShowStore,
  ) {
    super();
  }

  @Saga.on(UserCreated)
  async onUserCreated(event: UserCreated) {
    const { referrerId, id, duringShow } = event.payload;

    if (referrerId) {
      await Promise.all([
        this.intentBus.handle(
          new CreditUserBalanceCommand({
            actor: Actor.root(),
            userId: referrerId,
            amount: 50,
            transfer: {
              label: "Referral bonus",
            },
          }),
        ),
        this.intentBus.handle(
          new CreditUserBalanceCommand({
            actor: Actor.root(),
            userId: id,
            amount: 50,
            transfer: {
              label: "Referral bonus",
            },
          }),
        ),
      ]);
    }

    if (duringShow) {
      const show = await this.showStore.load(duringShow);

      if (!show) {
        throw ApplicationError.notFound(Show, duringShow);
      }

      await this.intentBus.handle(
        new CreditUserBalanceCommand({
          actor: Actor.root(),
          userId: id,
          amount: show.reward,
          transfer: {
            label: "Show entry",
          },
        }),
      );
    }
  }
}
