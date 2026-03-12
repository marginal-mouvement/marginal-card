import { PlatformSDK } from "@marginal-card/platform-sdk";
import { toast } from "sonner";

import { KeyStore } from "@/modules/key/key.store.ts";

export const platformSDK = new PlatformSDK(
  import.meta.env.VITE_PLATFORM_BASE_URL,
)
  .onError((error) => {
    toast.error(error.message);
  })
  .setKeyId(KeyStore.load());
