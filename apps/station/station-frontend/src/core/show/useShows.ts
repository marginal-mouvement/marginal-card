import { useCallback, useEffect, useState } from "react";
import type {
  CreateShowContract,
  SimpleShow,
} from "@marginal-card/platform-sdk";
import type { PayloadOf } from "@marginal-card/types";

import { platformSDK } from "@/core/platform/platformSDK.ts";

export function useShows() {
  const [showsLoading, setShowsLoading] = useState(true);
  const [shows, setShows] = useState<SimpleShow[]>([]);

  useEffect(() => {
    async function fetchShows() {
      const shows = await platformSDK.show.all();
      setShows(shows);
      setShowsLoading(false);
    }

    fetchShows().catch(console.error);
  }, []);

  const createShow = useCallback(
    async (payload: PayloadOf<CreateShowContract>) => {
      const show = await platformSDK.show.create(payload);
      setShows((shows) =>
        shows.some((s) => s.id === show.id) ? shows : [...shows, show],
      );
    },
    [],
  );

  return { shows, showsLoading, createShow };
}
