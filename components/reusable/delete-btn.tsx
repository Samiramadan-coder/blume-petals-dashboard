"use client";

import {
  Dialog,
  DialogClose,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogDescription,
} from "../ui/dialog";
import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export default function DeleteBtn({
  onDelete,
  loading,
}: {
  loading?: boolean;
  onDelete?: () => Promise<void>;
}) {
  const t = useTranslations("Common");
  const closeBtn = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    await onDelete?.();
    closeBtn.current?.click();
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost">
              <Trash2 className="text-destructive/70" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>{t("Delete")}</TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-md">
        <DialogClose asChild>
          <Button className="hidden" ref={closeBtn}></Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle className="text-destructive/70">
            {t("Delete")}
          </DialogTitle>
          <DialogDescription>{t("DeleteConfirmation")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            {loading ? <Spinner /> : t("Confirmation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
