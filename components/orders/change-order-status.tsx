import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import {
  bulletsClasses,
  labelClasses,
  orderStatuses,
  statusColorClasses,
} from "@/constants/orders";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Order } from "@/types/orders";
import { Spinner } from "../ui/spinner";
import { useTranslations } from "next-intl";
import { changeOrderStatus } from "@/lib/orders";
import { usePermissions } from "@/providers/permission-providers";

export default function ChangeOrderStatus({
  order,
  view = "select",
}: {
  order: Order;
  view?: "select" | "button";
}) {
  const { can } = usePermissions();
  const t = useTranslations("Orders");
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const canEdit = can("orders.edit");
  const isPending = pendingStatus !== null;

  const finalStatuses =
    order.fulfillment_method === "pickup"
      ? orderStatuses(t).filter((status) => status.value !== "shipped")
      : orderStatuses(t).filter(
          (status) => status.value !== "ready_for_pickup",
        );

  const statusIndex = finalStatuses.findIndex(
    (status) => status.value === order.status,
  );

  // One request at a time, and never for the status the order already has
  async function handleChange(status: string) {
    if (isPending || status === order.status) return;

    setPendingStatus(status);

    try {
      const result = await changeOrderStatus(order.id, status, "");

      if (result.success) {
        toast.success(t("OrderChangedSuccessfully"));
        return;
      }

      toast.error(result.message ?? t("OrderChangeFailed"));
    } catch (error) {
      console.error("Error changing order status:", error);
      toast.error(t("OrderChangeFailed"));
    } finally {
      setPendingStatus(null);
    }
  }

  return (
    <>
      {view === "select" ? (
        <Select
          disabled={!canEdit || isPending}
          value={order.status}
          onValueChange={(value) => void handleChange(value)}
        >
          <SelectTrigger
            aria-label={t("ChangeStatus")}
            className={cn(
              "h-6! min-h-5 bg-white border-0 leading-none rounded-full text-[11px] font-semibold",
              statusColorClasses[order.status],
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* A status outside the list (index -1) must not hide the options */}
              {finalStatuses.slice(Math.max(statusIndex, 0)).map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex flex-col gap-2">
          {finalStatuses.map((status, index) => {
            const isCurrent = status.value === order.status;
            const isPast = statusIndex > index;

            return (
              <button
                type="button"
                key={status.value}
                aria-pressed={isCurrent}
                disabled={!canEdit || isPast || isPending}
                className={cn(
                  "w-full h-11 border-2 flex items-center justify-between rounded-lg px-3 py-2",
                  isCurrent && "border-primary",
                  isPast || !canEdit
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer",
                )}
                onClick={() => void handleChange(status.value)}
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
                {pendingStatus === status.value ? (
                  <Spinner className="text-primary" />
                ) : (
                  isCurrent && <Check className="size-4 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
