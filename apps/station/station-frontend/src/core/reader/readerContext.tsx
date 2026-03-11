import {
  type ActionDispatch,
  createContext,
  type PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
} from "react";

import { stationSDK } from "@/core/sdk/stationSDK.ts";
import type { Reader, ReaderAction, ReaderDict } from "@/core/reader/types.ts";
import { Readers } from "@/core/reader/readers.ts";

interface ReaderContextProps {
  readerDict: Record<string, Reader>;
  readerList: Reader[];
  dispatchReaderAction: ActionDispatch<[action: ReaderAction]>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const ReaderContext = createContext<ReaderContextProps>(null!);

export const ReaderContextProvider = ({ children }: PropsWithChildren) => {
  const [readerDict, dispatchReaderAction] = useReducer(
    Readers.reducer,
    {} as ReaderDict,
  );

  useEffect(() => {
    async function fetchReaders() {
      const res = await stationSDK.reader.list();

      dispatchReaderAction({
        type: "fetch-initial-data",
        payload: res,
      });
    }

    fetchReaders().catch(console.error);

    return stationSDK.subscribeToEvents((event) => {
      if (event.name === "Handshake") {
        return;
      }

      console.log(event);

      dispatchReaderAction({
        type: "apply-event",
        payload: event,
      });
    });
  }, []);

  const readerList = useMemo(() => Object.values(readerDict), [readerDict]);

  const value = useMemo(
    () => ({ readerDict, readerList, dispatchReaderAction }),
    [readerDict, readerList],
  );

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
};
