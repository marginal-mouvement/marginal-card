export interface Transaction {
  onCommit(effect: () => Promise<void>): void;
  executeCommitListeners(): Promise<void>;
}

export type TransactionEffect<Result> = (
  transaction: Transaction,
) => Promise<Result>;

export interface TransactionPerformer {
  perform<Result>(effect: TransactionEffect<Result>): Promise<Result>;
}
