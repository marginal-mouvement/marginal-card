import { use } from "react";

import { ReaderContext } from "@/core/reader/readerContext.tsx";

export function useReader(readerId: string) {
  const { readerDict, dispatchReaderAction } = use(ReaderContext);

  const reader = readerDict[readerId]!;

  return { reader, dispatchReaderAction };
}
