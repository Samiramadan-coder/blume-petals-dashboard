import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function DeleteBtn() {
  const t = useTranslations("Common");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          <Trash2 className="text-muted-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">{t("Delete")}</DialogTitle>
          <DialogDescription>{t("DeleteConfirmation")}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
          <Button type="button" variant="destructive">
            {t("Confirmation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
