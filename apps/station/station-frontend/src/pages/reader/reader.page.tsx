import { Eye, PencilLine } from "lucide-react";
import { useState } from "react";

import { Page } from "@/parts/page.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { useReader } from "@/core/reader/useReader.ts";
import { ReaderRead } from "@/pages/reader/components/readerRead.tsx";
import { ReaderWrite } from "@/pages/reader/components/readerWrite.tsx";

interface ReaderPageProps {
  readerId: string;
  readerName: string;
}

export const ReaderPage = ({ readerName, readerId }: ReaderPageProps) => {
  const { reader } = useReader(readerId);
  const [tab, setTab] = useState("read");

  return (
    <Page title="Readers" muted={readerName}>
      <div className="flex flex-col gap-4">
        <Tabs defaultValue={tab} onValueChange={setTab}>
          <TabsList variant="line">
            <TabsTrigger value="read" disabled={reader.locked}>
              <Eye /> Read
            </TabsTrigger>
            <TabsTrigger value="write" disabled={reader.locked}>
              <PencilLine /> Write
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {tab === "read" ? (
          <ReaderRead readerId={readerId} />
        ) : (
          <ReaderWrite readerId={readerId} />
        )}
      </div>
    </Page>
  );
};
