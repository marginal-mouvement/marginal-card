import { SDK } from "@marginal-card/sdk";

import type {
  GetReadersContract,
  SetReaderIdleContract,
  WriteKeyIdContract,
} from "./reader";
import type { StationSubscriptionTopics } from "./stationSubscriptionTopics";

export class ReaderService {
  constructor(private readonly sdk: SDK) {}

  setIdle(readerName: string) {
    return this.sdk.fetch<SetReaderIdleContract>("/reader/idle", "POST", {
      readerName,
    });
  }

  writeKey(keyId: string, readerId: string) {
    return this.sdk.fetch<WriteKeyIdContract>("/reader/write", "POST", {
      keyId,
      readerId,
    });
  }

  list() {
    return this.sdk.fetch<GetReadersContract>("/reader/list", "GET", undefined);
  }
}

export class StationSDK extends SDK<StationSubscriptionTopics> {
  readonly reader: ReaderService;

  constructor(baseUrl: string) {
    super(baseUrl);
    this.reader = new ReaderService(this);
  }
}
