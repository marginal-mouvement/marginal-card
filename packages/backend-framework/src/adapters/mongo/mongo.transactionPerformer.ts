import { InfrastructureError, Logger, TransactionPerformer } from "../../core";
import { ClientSession, Db, MongoClient } from "mongodb";
import { TransactionEffect } from "../../core/store/transaction";
import { MongoTransaction } from "./mongo.transaction";

function hasLabel(err: unknown, label: string): boolean {
  const anyErr = err as any;
  const labels: string[] | undefined = anyErr?.errorLabels;
  return Array.isArray(labels) && labels.includes(label);
}

function isUnknownCommitResult(err: unknown): boolean {
  return hasLabel(err, "UnknownTransactionCommitResult");
}

function isTransientTransactionError(err: unknown): boolean {
  return hasLabel(err, "TransientTransactionError");
}

export class MongoTransactionPerformer implements TransactionPerformer {
  private readonly client: MongoClient;

  private readonly logger = Logger.for(MongoTransactionPerformer);

  constructor(private readonly db: Db) {
    this.client = db.client;
  }

  private static MaxAttempts = 5;
  private static MaxCommitAttempts = 5;

  async perform<T>(effect: TransactionEffect<T>): Promise<T> {
    for (
      let attempt = 0;
      attempt < MongoTransactionPerformer.MaxAttempts;
      attempt++
    ) {
      const session = this.client.startSession();
      const transaction = new MongoTransaction(session);

      try {
        session.startTransaction();
        const result = await effect(transaction);

        await this.tryToCommit(session);
        await transaction.executeCommitListeners();

        return result;
      } catch (e) {
        if (session.inTransaction()) {
          await session.abortTransaction().catch(this.logger.error);
        }

        if (isTransientTransactionError(e)) {
          continue;
        }

        throw e;
      } finally {
        await session.endSession();
      }
    }

    throw InfrastructureError.because("Exceeded max attempts for transaction");
  }

  private async tryToCommit(session: ClientSession): Promise<void> {
    for (
      let attempt = 0;
      attempt < MongoTransactionPerformer.MaxCommitAttempts;
      attempt++
    ) {
      try {
        await session.commitTransaction();
        return;
      } catch (e) {
        if (isUnknownCommitResult(e)) {
          continue;
        }

        throw e;
      }
    }

    throw InfrastructureError.because("Max commit attempts exceeded");
  }
}
