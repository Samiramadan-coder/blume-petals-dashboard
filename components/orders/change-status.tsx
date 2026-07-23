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
import { OrderStatus, orderStatusSchema } from "@/types/orders";
import NormalFormSelect from "../form/select";
import { Button } from "@/components/ui/button";
import NormalFormRichText from "../form/rich-text";
import { orderStatuses } from "@/constants/orders";
import { useForm, SubmitHandler } from "react-hook-form";
import { changeOrderStatus } from "@/lib/orders-actions";
import { zodResolver } from "@hookform/resolvers/zod";

export function ChangeStatus({
  startIndex,
  orderId,
}: {
  startIndex: number;
  orderId: number;
}) {
  const t = useTranslations("Orders");
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<OrderStatus>({
    defaultValues: { status: "", note: "" },
    resolver: zodResolver(orderStatusSchema(t)),
  });

  const onSubmit: SubmitHandler<OrderStatus> = async (data) => {
    const result = await changeOrderStatus(
      orderId,
      data.status,
      data.note || "",
    );

    if (result.success) {
      toast.success(t("StatusChangedSuccessfully"));
      closeButtonRef?.current?.click();
      return;
    }

    toast.error(t("OrderChangeFailed"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="text-xs text-foreground">
          {t("ChangeStatus")}
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <form
          className="space-y-4"
          ref={formRef}
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
        >
          <NormalFormSelect
            control={control}
            name="status"
            label={t("Status")}
            options={orderStatuses(t)
              .slice(startIndex + 1)
              .map((status) => ({
                label: status.label,
                value: status.value,
              }))}
          />

          <NormalFormRichText
            control={control}
            label={t("Note")}
            name="note"
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
            {isSubmitting ? <Spinner /> : t("ChangeStatus")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
