import { useCallback, useEffect, useState } from "react";
import type { SimpleUser } from "@marginal-card/platform-sdk";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { useReader } from "@/core/reader/useReader.ts";
import { PulseRingIcon } from "@/components/icons/svg-spinners-pulse-ring.tsx";
import { ReaderStatus } from "@/pages/reader/components/readerStatus.tsx";
import { platformSDK } from "@/core/platform/platformSDK.ts";
import { UserCard } from "@/pages/reader/components/userCard.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";

interface ReaderReadProps {
  readerId: string;
}

export const ReaderRead = ({ readerId }: ReaderReadProps) => {
  const { reader, dispatchReaderAction } = useReader(readerId);
  const [user, setUser] = useState<SimpleUser | undefined>(undefined);

  const [action, setAction] = useState<"debit" | "credit">("debit");
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = useCallback(async () => {
    if (!reader.keyId) {
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
      return;
    }

    const user = await platformSDK.user.byKey(reader.keyId).catch((e) => {
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
      throw e;
    });
    setUser(user);
  }, [dispatchReaderAction, reader.keyId, readerId]);

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

    handleScan().catch(console.error);
  }, [dispatchReaderAction, handleScan, reader.keyId, readerId]);

  const handleCancel = useCallback(() => {
    setUser(undefined);
    dispatchReaderAction({
      type: "unlock-reader",
      payload: {
        readerId,
      },
    });
  }, [dispatchReaderAction, readerId]);

  const debitOrCredit = useCallback(async () => {
    if (!user) {
      return;
    }
    setIsLoading(true);
    try {
      if (action === "debit") {
        await platformSDK.user.debit({
          userId: user.id,
          amount: Number(amount),
          label,
        });
      } else {
        await platformSDK.user.credit({
          userId: user.id,
          amount: Number(amount),
          label,
        });
      }
      toast.success("Transaction successful");
      setUser(undefined);
      dispatchReaderAction({
        type: "unlock-reader",
        payload: {
          readerId,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [action, amount, dispatchReaderAction, label, readerId, user]);

  return (
    <div className="flex flex-col gap-10">
      <ReaderStatus
        readerId={readerId}
        badgeVariant="outline"
        text="Awaiting key..."
        icon={<PulseRingIcon />}
      />
      {user && (
        <>
          <UserCard user={user} />
          <div className="flex flex-col gap-4 w-sm">
            <div className="flex gap-4 items-center">
              <Tabs defaultValue={action} onValueChange={setAction as any}>
                <TabsList>
                  <TabsTrigger value="debit">Debit</TabsTrigger>
                  <TabsTrigger value="credit">Credit</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="xs" onClick={handleCancel}>
                <RotateCcw /> Cancel
              </Button>
            </div>

            <Input
              placeholder="Label"
              onChangeText={setLabel}
              disabled={isLoading}
            />
            <Input
              placeholder="Amount"
              onChangeText={setAmount}
              disabled={isLoading}
            />
            <Button
              className="w-fit"
              onClick={debitOrCredit}
              disabled={!label || !amount || isLoading}
            >
              {action}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
