import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from "react";
import type {
  CreateShowContract,
  SimpleShow,
} from "@marginal-card/platform-sdk";
import type { PayloadOf } from "@marginal-card/types";

import { platformSDK } from "@/core/platform/platformSDK.ts";

interface ShowContext {
  shows: SimpleShow[];
  showsLoading: boolean;
  createShow: (payload: PayloadOf<CreateShowContract>) => Promise<void>;
  fetchShows: () => void;
  fetchError?: Error;
  retry: () => void;
}

// eslint-disable-next-line ts/no-redeclare, react-refresh/only-export-components
export const ShowContext = createContext<ShowContext>(null!);

export const ShowContextProvider = ({ children }: PropsWithChildren) => {
  const [showsLoading, setShowsLoading] = useState(true);
  const [shows, setShows] = useState<SimpleShow[]>([]);

  const [fetchInitiated, setFetchInitiated] = useState(false);
  const [fetchError, setFetchError] = useState<Error | undefined>(undefined);

  const fetchShows = useCallback(() => {
    if (fetchInitiated) {
      return;
    }

    setFetchInitiated(true);
    platformSDK.show
      .all()
      .then((res) => {
        setShowsLoading(false);
        setShows(res);
      })
      .catch((err) => {
        setFetchError(err);
      });
  }, [fetchInitiated]);

  const retry = useCallback(() => {
    console.log("here");
    setShowsLoading(true);
    setFetchInitiated(false);
    setFetchError(undefined);
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

  const value = useMemo(
    () => ({
      showsLoading,
      shows,
      createShow,
      fetchShows,
      fetchError,
      retry,
    }),
    [createShow, fetchError, fetchShows, retry, shows, showsLoading],
  );

  return <ShowContext.Provider value={value}>{children}</ShowContext.Provider>;
};
