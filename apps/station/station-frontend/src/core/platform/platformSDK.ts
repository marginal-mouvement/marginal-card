import { PlatformSDK } from "@marginal-card/platform-sdk";
import { toast } from "sonner";

import { PlatformApiKeyStore } from "@/core/platform/platformApiKey.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
)
  .setApiKey(PlatformApiKeyStore.load())
  .onError((error) => {
    toast.error(error.message);
  });
