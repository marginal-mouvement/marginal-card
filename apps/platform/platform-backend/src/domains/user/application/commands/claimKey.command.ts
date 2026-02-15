import {
  ApplicationError,
  Command,
  CommandHandler,
  TransactionPerformer,
} from "@marginal-card/backend-framework";
import { Email } from "../../domain/email";
import { KeyId } from "../../../key/domain/keyId";
import { UserStore } from "../user.store";
import { KeyStore } from "../../../key/application/key.store";
import { User } from "../../domain/user";
import { Key } from "../../../key/domain/key";

export class ClaimKeyCommand extends Command {
  constructor(
    readonly payload: {
      email: Email;
      name: string;
      keyId: KeyId;
      refererName: string | undefined;
    },
  ) {
    super();
  }
}

export class ClaimKeyCommandHandler extends CommandHandler(ClaimKeyCommand) {
  constructor(
    private readonly userStore: UserStore,
    private readonly keyStore: KeyStore,
    private readonly transactionPerformer: TransactionPerformer,
  ) {
    super();
  }

  async execute(command: ClaimKeyCommand) {
    const { keyId, name, refererName, email } = command.payload;

    let referrer: User | undefined;

    if (refererName) {
      referrer = await this.userStore.loadByName(refererName);

      if (!referrer) {
        throw ApplicationError.notFound(User, refererName);
      }
    }

    const existingName = await this.userStore.loadByName(name);

    if (existingName) {
      throw ApplicationError.conflict(`Name "${name}" taken`);
    }

    await this.transactionPerformer.perform(async (transaction) => {
      const user = User.create(name, email, referrer?.id);

      const key = await this.keyStore.load(keyId, transaction);

      if (!key) {
        throw ApplicationError.notFound(Key, keyId);
      }

      key.assign(user.id);

      await this.userStore.save(user, transaction);
      await this.keyStore.save(key, transaction);
    });
  }
}
