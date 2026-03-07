import { SDK } from "@marginal-card/sdk";

import type { CreateKeyContract } from "./contracts";

export class KeyService {
  constructor(private readonly sdk: SDK) {}

  create() {
    return this.sdk.fetch<CreateKeyContract>("/key/create", "POST", undefined);
  }
}

export class PlatformSDK extends SDK {
  readonly key: KeyService;

  constructor(baseUrl: string, apiKey?: string) {
    super(baseUrl, apiKey);
    this.key = new KeyService(this);
  }
}
