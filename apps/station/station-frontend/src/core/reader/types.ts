import type {
  GetReadersContract,
  StationSubscriptionTopics,
} from "@marginal-card/station-sdk";
import type { ResultOf } from "@marginal-card/types";

export interface Reader {
  id: string;
  name: string;
  keyPresence: boolean;
  locked: boolean;
  keyId: string | undefined;
  lastEvent: StationSubscriptionTopics["reader:*"]["name"] | undefined;
}

interface FetchInitialDataAction {
  type: "fetch-initial-data";
  payload: ResultOf<GetReadersContract>;
}

interface ApplyEventAction {
  type: "apply-event";
  payload: StationSubscriptionTopics["reader:*"];
}

interface LockReaderAction {
  type: "lock-reader";
  payload: { readerId: string };
}

interface UnlockReaderAction {
  type: "unlock-reader";
  payload: { readerId: string };
}

export type ReaderAction =
  | FetchInitialDataAction
  | ApplyEventAction
  | LockReaderAction
  | UnlockReaderAction;

export type ReaderDict = Record<string, Reader>;
