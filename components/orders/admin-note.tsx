import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus } from "lucide-react";
import NormalFormRichText from "../form/rich-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAdminNote } from "@/lib/orders-actions";
import { useForm, SubmitHandler } from "react-hook-form";
import { AdminNote, AdminNoteSchema } from "@/types/orders";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function AddAdminNote({
  orderId,
  adminNotes,
}: {
  orderId: number;
  adminNotes: string | null;
}) {
  const t = useTranslations("Orders");
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AdminNote>({
    defaultValues: { admin_notes: adminNotes || "" },
    resolver: zodResolver(AdminNoteSchema(t)),
  });

  const onSubmit: SubmitHandler<AdminNote> = async (data) => {
    const result = await updateAdminNote(orderId, data.admin_notes);

    if (result.success) {
      toast.success(t("AdminNoteUpdatedSuccessfully"));
      closeButtonRef?.current?.click();
      return;
    }

    toast.error(t("AdminNoteUpdateFailed"));
  };

  return (
    <Dialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="default" className="text-xs text-foreground">
              <MessageSquarePlus />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>{t("AdminNote")}</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <form
          className="space-y-4"
          ref={formRef}
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <NormalFormRichText
            control={control}
            label={t("Note")}
            name="admin_notes"
            placeholder={t("EnterNote")}
          />
        </form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button className="hidden" ref={closeButtonRef}></Button>
          </DialogClose>

          <Button
            type="button"
            className="text-foreground"
            onClick={() => formRef?.current?.requestSubmit()}
          >
            {isSubmitting ? <Spinner /> : t("AdminNote")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
