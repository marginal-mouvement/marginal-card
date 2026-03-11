import { useEffect } from "react";

import { useReader } from "@/core/reader/useReader.ts";
import { PulseRingIcon } from "@/components/icons/svg-spinners-pulse-ring.tsx";
import { ReaderStatus } from "@/pages/reader/components/readerStatus.tsx";

interface ReaderReadProps {
  readerId: string;
}

export const ReaderRead = ({ readerId }: ReaderReadProps) => {
  const { reader, dispatchReaderAction } = useReader(readerId);

  useEffect(() => {
    if (reader.keyId === undefined) {
      return;
    }

    dispatchReaderAction({
      type: "lock-reader",
      payload: {
        readerId,
      },
    });
  }, [dispatchReaderAction, reader.keyId, readerId]);

  return (
    <ReaderStatus
      readerId={readerId}
      badgeVariant="outline"
      text="Awaiting key..."
      icon={<PulseRingIcon />}
    />
  );
};
