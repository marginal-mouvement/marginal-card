import type { SimpleShow } from "@marginal-card/platform-sdk";
import { Calendar, Ellipsis, Gift } from "lucide-react";

import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { DateFormatter } from "@/lib/utils.ts";
import { Button } from "@/components/ui/button.tsx";

interface ShowCardProps {
  show: SimpleShow;
}

export const ShowCard = ({ show }: ShowCardProps) => {
  return (
    <Card className="relative mx-auto w-full pt-0">
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-1 right-1 z-40"
      >
        <Ellipsis />
      </Button>
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={show.thumbnailUrl}
        alt="Event cover"
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardAction>
          <Badge>
            <Gift /> +{show.reward}pts
          </Badge>
        </CardAction>
        <CardTitle>{show.name}</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-1 mt-1">
            <Calendar size={14} />{" "}
            <div className="text-xs">
              {DateFormatter.format(new Date(show.date))}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
