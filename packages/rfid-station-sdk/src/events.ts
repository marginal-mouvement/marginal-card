import type { SubscriptionEvent } from "@marginal-card/types";

type ReaderConnected = SubscriptionEvent<
  "ReaderConnected",
  {
    readerId: string;
  }
>;

type ReaderDisconnected = SubscriptionEvent<
  "ReaderDisconnected",
  {
    readerId: string;
  }
>;

type ReaderNotFound = SubscriptionEvent<
  "ReaderNotFound",
  {
    forwardedName: string;
  }
>;

type NoTagRead = SubscriptionEvent<
  "NoTagRead",
  {
    readerId: string;
  }
>;

type KeyIdRead = SubscriptionEvent<
  "KeyIdRead",
  {
    readerId: string;
    keyId: string;
  }
>;

export type KeyIdWritten = SubscriptionEvent<
  "KeyIdWritten",
  {
    readerId: string;
  }
>;

export type RfidStationSubscriptionTopics = {
  "reader:*":
    | KeyIdRead
    | NoTagRead
    | ReaderConnected
    | ReaderDisconnected
    | ReaderNotFound
    | KeyIdWritten;
};
