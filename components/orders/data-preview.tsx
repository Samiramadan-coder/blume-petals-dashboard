"use client";

import { Badge } from "../ui/badge";
import Statistics from "./statistics";
import { Checkbox } from "../ui/checkbox";
import OrderDetails from "./order-details";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { AddAdminNote } from "./admin-note";
import { cn, formatDate } from "@/lib/utils";
import { Order, Summary } from "@/types/orders";
import FiltersControl from "./filters-control";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { columns, statusColorClasses } from "@/constants/orders";
import { usePermissions } from "@/providers/permission-providers";
import ChangeOrderStatus from "./change-order-status";

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
  const { can } = usePermissions();
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
                <ChangeOrderStatus order={order} />
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  {formatDate(order.placed_at)}
                </p>
              </TableCell>

              <TableCell className="px-4 py-3 space-x-2">
                <OrderDetails order={order} />

                {can("orders.edit") && (
                  <AddAdminNote
                    orderId={order.id}
                    adminNotes={order.admin_notes}
                  />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}
