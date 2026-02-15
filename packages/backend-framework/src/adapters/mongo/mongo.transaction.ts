import { Transaction } from "../../core";
import { ClientSession } from "mongodb";

export class MongoTransaction implements Transaction {
  private readonly commitCallbacks: (() => Promise<void>)[] = [];

  constructor(readonly session: ClientSession) {}

  onCommit(effect: () => Promise<void>) {
    this.commitCallbacks.push(effect);
  }

  async executeCommitListeners() {
    for (const callback of this.commitCallbacks) {
      await callback();
    }
  }
}
