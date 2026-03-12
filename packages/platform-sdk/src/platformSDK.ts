import { SDK } from "@marginal-card/sdk";
import type { PayloadOf } from "@marginal-card/types";

import type { CreateKeyContract, IsKeyAvailableContract } from "./key";
import type { ClaimKeyContract, MeContract } from "./user";
import type { AllShowsContract, CreateShowContract } from "./show";
import type { AllMyTransfersContract } from "./transfer";

class KeyService {
  constructor(private readonly sdk: SDK) {}

  create(showId?: string) {
    return this.sdk.fetch<CreateKeyContract>("/key/create", "POST", {
      showId,
    });
  }

  async isAvailable(keyId: string) {
    return (
      await this.sdk.fetch<IsKeyAvailableContract>("/key/available", "POST", {
        keyId,
      })
    ).available;
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

class TransferService {
  constructor(private readonly sdk: SDK) {}

  allMines() {
    return this.sdk.fetch<AllMyTransfersContract>(
      "/transfer/my",
      "GET",
      undefined,
    );
  }
}

export class PlatformSDK extends SDK {
  readonly key = new KeyService(this);
  readonly user = new UserService(this);
  readonly show = new ShowService(this);
  readonly transfer = new TransferService(this);

  constructor(baseUrl: string) {
    super(baseUrl);
  }
}
