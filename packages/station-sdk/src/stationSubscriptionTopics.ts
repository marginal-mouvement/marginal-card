import type {
  KeyIdRead,
  KeyOff,
  KeyOn,
  NoTagRead,
  ReaderConnected,
  ReaderDisconnected,
  ReaderNotFound,
  ReaderUnknownError,
  ReadFailed,
} from "./reader";

export type StationSubscriptionTopics = {
  "reader:*":
    | KeyOn
    | KeyOff
    | KeyIdRead
    | NoTagRead
    | ReaderConnected
    | ReaderDisconnected
    | ReaderNotFound
    | ReadFailed
    | ReaderUnknownError;
};
