import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Order } from "@/types/orders";
import { useTranslations } from "next-intl";
import { changeOrderStatus } from "@/lib/orders-actions";
import { usePermissions } from "@/providers/permission-providers";
import {
  bulletsClasses,
  labelClasses,
  orderStatuses,
  statusColorClasses,
} from "@/constants/orders";
import { Check } from "lucide-react";

export default function ChangeOrderStatus({
  order,
  view = "select",
}: {
  order: Order;
  view?: "select" | "button";
}) {
  const { can } = usePermissions();
  const t = useTranslations("Orders");

  const statusIndex = orderStatuses(t).findIndex(
    (status) => status.value === order.status,
  );

  return (
    <>
      {view === "select" ? (
        <Select
          disabled={!can("orders.edit")}
          value={order.status}
          onValueChange={async (value) => {
            const result = await changeOrderStatus(order.id, value, "");
            if (result.success) {
              toast.success(t("OrderChangedSuccessfully"));
              return;
            }
            toast.error(t("OrderChangeFailed"));
          }}
        >
          <SelectTrigger
            className={cn(
              "h-6! min-h-5 bg-white border-0 leading-none rounded-full text-[11px] font-semibold",
              statusColorClasses[order.status],
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {orderStatuses(t)
                .slice(statusIndex)
                .map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex flex-col gap-2">
          {orderStatuses(t).map((status, index) => (
            <div
              key={status.value}
              className={cn(
                "w-full h-11 border-2 flex items-center justify-between rounded-lg px-3 py-2",
                status.value === order.status && "border-primary",
                statusIndex > index && "cursor-not-allowed opacity-50",
              )}
              onClick={async () => {
                if (statusIndex > index) {
                  return;
                }
                const result = await changeOrderStatus(
                  order.id,
                  status.value,
                  "",
                );
                if (result.success) {
                  toast.success(t("OrderChangedSuccessfully"));
                  return;
                }
                toast.error(t("OrderChangeFailed"));
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    bulletsClasses[status.value],
                  )}
                />
                <span className={cn(labelClasses[status.value])}>
                  {status.label}
                </span>
              </div>
              {status.value === order.status && (
                <Check className="size-4 text-primary" />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
