import { type ReactNode, useCallback, useState } from "react";
import { Plus } from "lucide-react";
import type { PayloadOf } from "@marginal-card/types";
import type { CreateShowContract } from "@marginal-card/platform-sdk";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Field, FieldLabel } from "@/components/ui/field.tsx";
import { Input } from "@/components/ui/input.tsx";
import { DatePicker } from "@/components/ui/datePicker.tsx";
import { Button } from "@/components/ui/button.tsx";
import { AspectRatio } from "@/components/ui/aspect-ratio.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";

interface CreateShowDialogProps {
  children: ReactNode;
  createShow: (payload: PayloadOf<CreateShowContract>) => Promise<void>;
}

export const CreateShowDialog = ({
  children,
  createShow,
}: CreateShowDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [reward, setReward] = useState("");
  const [date, setDate] = useState(new Date());

  const handleRewardChange = useCallback((value: string) => {
    if (value === "") {
      setReward("");
      return;
    }

    const numberValue = Number(value);

    if (Number.isNaN(numberValue) || numberValue < 1 || value.includes(".")) {
      return;
    }

    setReward(value.trim());
  }, []);

  const handleOpenChange = useCallback(
    (newValue: boolean) => {
      if (newValue) {
        setOpen(true);
        return;
      }

      if (isLoading) {
        return;
      }

      setName("");
      setThumbnail("");
      setReward("");
      setDate(new Date());
      setOpen(false);
    },
    [isLoading],
  );

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !reward.trim()) {
      toast.error("Name and reward are required");
      return;
    }

    setIsLoading(true);
    await createShow({
      name: name.trim(),
      reward: Number(reward),
      thumbnailUrl: thumbnail.trim() ? thumbnail.trim() : undefined,
      date,
    });
    setIsLoading(false);
    handleOpenChange(false);
  }, [createShow, date, handleOpenChange, name, reward, thumbnail]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Show</DialogTitle>
          <DialogDescription>
            It can be an event, a pop-up. The reward represents the points that
            the user earns by being a part of the show. Thumbnail is optional.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 items-center">
          <div className="w-40">
            <AspectRatio ratio={1} className="rounded-lg bg-muted">
              {thumbnail.trim() && (
                <img
                  src={thumbnail}
                  className="w-full h-full rounded-lg object-cover"
                  alt="Show thumbnail"
                />
              )}
            </AspectRatio>
          </div>

          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              disabled={isLoading}
              placeholder="Marginal gate 1"
              value={name}
              onChangeText={setName}
            />
          </Field>
          <Field>
            <FieldLabel>
              Thumbnail{" "}
              <span className="text-muted-foreground font-light">
                (optional)
              </span>
            </FieldLabel>
            <Input
              placeholder="https://..."
              value={thumbnail}
              onChangeText={setThumbnail}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel>Reward</FieldLabel>
            <Input
              placeholder="100"
              value={reward}
              onChangeText={handleRewardChange}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <DatePicker
              defaultValue={date}
              onDateChange={setDate}
              disabled={isLoading}
            />
          </Field>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? <Spinner /> : <Plus />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
