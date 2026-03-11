import { PlatformSDK } from "@marginal-card/platform-sdk";

import { KeyStore } from "@/modules/key/key.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
);

platformSDK.setKeyId(KeyStore.load());
