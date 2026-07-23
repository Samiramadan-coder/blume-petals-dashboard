import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import NormalFormSelect from "../form/select";
import { Button } from "@/components/ui/button";
import { orderStatuses } from "@/constants/orders";
import NormalFormRichText from "../form/rich-text";
import { OrderStatus } from "@/types/orders";
import { changeOrderStatus } from "@/lib/orders-actions";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";

export function ChangeStatus({
  status,
  orderId,
}: {
  status: string;
  orderId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<{ status: string; note: string }>({
    defaultValues: {
      status: status as OrderStatus["value"],
      note: "",
    },
  });

  const onSubmit: SubmitHandler<{ status: string; note: string }> = async (
    data,
  ) => {
    const result = await changeOrderStatus(orderId, data.status, data.note);

    if (result.success) {
      toast.success("Order status changed successfully");
      closeButtonRef?.current?.click();
      return;
    }

    toast.error("Failed to change order status");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change Status</Button>
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
            label="Status"
            options={orderStatuses.slice(1).map((status) => ({
              label: status.label,
              value: status.value,
            }))}
          />

          <NormalFormRichText
            control={control}
            label="Note"
            name="note"
            placeholder="Enter a note"
          />
        </form>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button className="hidden" ref={closeButtonRef}></Button>
          </DialogClose>

          <Button
            type="button"
            onClick={() => formRef?.current?.requestSubmit()}
          >
            {isSubmitting ? <Spinner /> : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
