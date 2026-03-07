import type { KeyId } from "@marginal-card/backend-framework";
import { Command, CommandHandler } from "@marginal-card/backend-framework";

import type { Actor } from "../../../auth/domain/actor";
import { Key } from "../../domain/key";
import type { KeyStore } from "../key.store";

export class CreateKeyCommand extends Command<{ id: KeyId }> {
  constructor(
    readonly payload: {
      actor: Actor;
    },
  ) {
    super();
  }
}

export class CreateKeyCommandHandler extends CommandHandler(CreateKeyCommand) {
  constructor(private readonly keyStore: KeyStore) {
    super();
  }

  async execute(command: CreateKeyCommand) {
    const { actor } = command.payload;

    actor.ensureIsAtLeastStation();

    const key = Key.create();

    await this.keyStore.save(key);

    return { id: key.id };
  }
}
