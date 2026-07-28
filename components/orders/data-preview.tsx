"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { toast } from "sonner";
import Statistics from "./statistics";
import { Checkbox } from "../ui/checkbox";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { AddAdminNote } from "./admin-note";
import { cn, formatDate } from "@/lib/utils";
import { columns } from "@/constants/orders";
import FiltersControl from "./filters-control";
import { Order, Summary } from "@/types/orders";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { orderStatuses } from "@/constants/orders";
import { changeOrderStatus } from "@/lib/orders-actions";
import { Badge } from "../ui/badge";

const statusColorClasses: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  pickup: "bg-violet-100 text-violet-800",
  cancelled: "bg-rose-100 text-rose-800",
};

const fulfillmentMethodColorClasses: Record<
  Order["fulfillment_method"],
  string
> = {
  delivery: "bg-secondary/10 text-secondary",
  pickup: "bg-primary/10 text-primary",
};

export default function DataPreview({
  orders,
  pagination,
  summary,
}: {
  orders: Order[];
  pagination: Pagination;
  summary: Summary;
}) {
  const t = useTranslations("Orders");

  return (
    <>
      <Statistics summary={summary} />
      <FiltersControl />

      <DataTable
        columns={columns(t)}
        rowsCount={orders.length}
        countUnit={t("Label")}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {orders.map((order, index) => {
          const statusIndex = orderStatuses(t).findIndex(
            (status) => status.value === order.status,
          );

          return (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <Checkbox />
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-bold">#{order.order_number}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/30 rounded-full">
                    {order.customer.name.slice(0, 1)}
                  </div>

                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <span className="text-muted-foreground mt-2 text-xs">
                      {order.channel}
                    </span>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="h-8 w-8 flex items-center justify-center bg-primary/70 font-semibold rounded-lg">
                  {order.items.length}
                </p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-bold">{order.summary.grand_total}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <Badge
                  className={cn(
                    "capitalize h-6",
                    statusColorClasses[order.status],
                    fulfillmentMethodColorClasses[order.fulfillment_method],
                  )}
                >
                  {order.fulfillment_method}
                </Badge>
              </TableCell>

              <TableCell className="px-4 py-3">
                <Select
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
                      "h-6 min-h-6 bg-white border-0 leading-none rounded-full text-[12px] font-semibold",
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
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  {formatDate(order.placed_at)}
                </p>
              </TableCell>

              <TableCell className="px-4 py-3 space-x-2">
                <AddAdminNote
                  orderId={order.id}
                  adminNotes={order.admin_notes}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}
