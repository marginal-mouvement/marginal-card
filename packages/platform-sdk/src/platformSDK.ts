import { SDK } from "@marginal-card/sdk";
import type { PayloadOf } from "@marginal-card/types";

import type { CreateKeyContract } from "./key";
import type { ClaimKeyContract, MeContract } from "./user";
import type { AllShowsContract, CreateShowContract } from "./show";

class KeyService {
  constructor(private readonly sdk: SDK) {}

  create(showId?: string) {
    return this.sdk.fetch<CreateKeyContract>("/key/create", "POST", {
      showId,
    });
  }
}

class UserService {
  constructor(private readonly sdk: SDK) {}

  claimKey(payload: PayloadOf<ClaimKeyContract>) {
    return this.sdk.fetch<ClaimKeyContract>("/user/claim-key", "POST", payload);
  }

  me() {
    return this.sdk.fetch<MeContract>("/user/me", "GET", undefined);
  }
}

class ShowService {
  constructor(private readonly sdk: SDK) {}

  create(payload: PayloadOf<CreateShowContract>) {
    return this.sdk.fetch<CreateShowContract>("/show/create", "POST", payload);
  }

  all() {
    return this.sdk.fetch<AllShowsContract>("/show/all", "GET", undefined);
  }
}

export class PlatformSDK extends SDK {
  readonly key = new KeyService(this);
  readonly user = new UserService(this);
  readonly show = new ShowService(this);

  constructor(baseUrl: string) {
    super(baseUrl);
  }
}
