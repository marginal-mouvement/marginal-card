import type { IntentBus} from "@marginal-card/backend-framework";
import { Saga } from "@marginal-card/backend-framework";

import { CreditUserBalanceCommand } from "./commands/creditUserBalance.command";

import { UserCreated } from "../domain/user";
import { Actor } from "../../auth/domain/actor";

export class UserSaga extends Saga {
  constructor(private readonly intentBus: IntentBus) {
    super();
  }

  @Saga.on(UserCreated)
  async onUserCreated(event: UserCreated) {
    const { referrerId, id } = event.payload;

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
  }
}
