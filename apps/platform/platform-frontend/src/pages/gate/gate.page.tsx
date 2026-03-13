import { ArrowUpRightIcon, Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/modules/auth/useUser.ts";
import { Header } from "@/parts/header.tsx";
import { Content } from "@/parts/content.tsx";
import { Card } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.tsx";
import { Button } from "@/components/ui/button.tsx";
import website from "@/assets/website.jpg";
import { Spinner } from "@/components/ui/spinner.tsx";

const PASSWORD = "MARGINALTHEWORLD!";

export const GatePage = () => {
  const user = useUser();

  const timeout = useRef<number | undefined>(undefined);

  const [copyButtonStatus, setCopyButtonStatus] = useState<
    "idle" | "loading" | "copied"
  >("idle");

  const handleCopyToClipboard = useCallback(async () => {
    try {
      setCopyButtonStatus("loading");
      await navigator.clipboard.writeText(PASSWORD);
      setCopyButtonStatus("copied");

      timeout.current = setTimeout(() => {
        setCopyButtonStatus("idle");
      }, 1000);
    } catch {
      toast.error("Erreur lors de la copie du mot de passe");
      setCopyButtonStatus("idle");
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return (
    <>
      <Header title={`Bienvenue, ${user.name}`} />
      <Content withHeader className="flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-lg text-center">UN T-SHIRT OFFERT</h3>
          <div className="flex flex-col gap-2">
            <div className="text-center font-medium">Entre le mot de passe</div>
            <InputGroup>
              <InputGroupInput
                readOnly
                className="text-center"
                value={PASSWORD}
              />
              <InputGroupAddon align="inline-end">
                <Button
                  size="icon-xs"
                  variant="ghost"
                  disabled={copyButtonStatus === "loading"}
                  onClick={handleCopyToClipboard}
                >
                  {copyButtonStatus === "idle" ? (
                    <Copy />
                  ) : copyButtonStatus === "loading" ? (
                    <Spinner />
                  ) : (
                    <Check />
                  )}
                </Button>
              </InputGroupAddon>
            </InputGroup>
            <a href="https://marginalmouvement.com/" target="_blank">
              <div className="relative">
                <img
                  src={website}
                  className="w-full rounded-lg object-cover"
                  alt="Show thumbnail"
                />
                <Badge className="absolute top-4 right-4">
                  Débloquer mon t-shirt gratuit <ArrowUpRightIcon />
                </Badge>
              </div>
            </a>
          </div>
        </div>
        <Separator />
        <div className="flex justify-center items-center flex-col gap-4 pt-16 pb-24">
          <Badge variant="secondary">Ton solde</Badge>
          <Card className="p-4">
            <h2 className="text-7xl font-bold text-primary">
              {user.balance}
              <span className="text-lg">pts</span>
            </h2>
          </Card>
        </div>
      </Content>
    </>
  );
};
