import { PlatformSDK } from "@marginal-card/platform-sdk";

import { PlatformApiKeyStore } from "@/core/platform/platformApiKey.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
);

platformSDK.setApiKey(PlatformApiKeyStore.load());
