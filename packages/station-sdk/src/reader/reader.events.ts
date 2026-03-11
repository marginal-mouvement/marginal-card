import type { SubscriptionEvent } from "@marginal-card/types";

export type ReaderConnected = SubscriptionEvent<
  "ReaderConnected",
  {
    readerId: string;
    readerName: string;
  }
>;

export type ReaderDisconnected = SubscriptionEvent<
  "ReaderDisconnected",
  {
    readerId: string;
  }
>;

export type ReaderNotFound = SubscriptionEvent<
  "ReaderNotFound",
  {
    readerId: string;
  }
>;

export type NoTagRead = SubscriptionEvent<
  "NoTagRead",
  {
    readerId: string;
  }
>;

export type ReadFailed = SubscriptionEvent<
  "ReadFailed",
  {
    readerId: string;
    error: string;
  }
>;

export type KeyIdRead = SubscriptionEvent<
  "KeyIdRead",
  {
    readerId: string;
    keyId: string;
  }
>;

export type ReaderUnknownError = SubscriptionEvent<
  "ReaderUnknownError",
  {
    readerId: string;
    error: string;
  }
>;

export type KeyOn = SubscriptionEvent<"KeyOn", { readerId: string }>;

export type KeyOff = SubscriptionEvent<"KeyOff", { readerId: string }>;
