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
import { toast } from "sonner";
import { Flag } from "lucide-react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteFlagReviewAction, flagReviewAction } from "@/lib/reviews";

export default function FlagReview({
  reviewId,
  isFlagged,
}: {
  reviewId: number;
  isFlagged: boolean;
}) {
  const t = useTranslations("Reviews");
  const [loading, setLoading] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);

  async function handleFlagReview() {
    setLoading(true);
    const result = isFlagged
      ? await deleteFlagReviewAction(reviewId)
      : await flagReviewAction(reviewId);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      closeBtn.current?.click();
      return;
    }

    toast.error(t("FlagFailed"));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="flex-1 bg-white text-xs font-normal"
          variant="outline"
        >
          <Flag /> {isFlagged ? t("Unflag") : t("Flag")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md ring-0!">
        <DialogClose asChild>
          <Button ref={closeBtn} className="hidden"></Button>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>{isFlagged ? t("Unflag") : t("Flag")}</DialogTitle>
          <DialogDescription>
            {isFlagged ? t("UnflagConfirmation") : t("FlagConfirmation")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <Button
            type="button"
            className="rounded-sm text-xs py-4 px-4"
            variant="destructive"
            onClick={handleFlagReview}
          >
            {loading ? <Spinner /> : isFlagged ? t("Unflag") : t("Flag")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
