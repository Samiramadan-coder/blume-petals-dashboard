"use client";

import { Badge } from "../ui/badge";
import Statistics from "./statistics";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { AddAdminNote } from "./admin-note";
import { columns } from "@/constants/orders";
import FiltersControl from "./filters-control";
import { ChangeStatus } from "./change-status";
import { Order, Summary } from "@/types/orders";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { orderStatuses } from "@/constants/orders";

const statusColorClasses: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  pickup: "bg-violet-100 text-violet-800",
  cancelled: "bg-rose-100 text-rose-800",
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
                <p className="font-bold">{order.order_number}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-semibold">{order.customer.name}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.items.length}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-bold">{order.summary.grand_total}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.fulfillment_method}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <Badge className={statusColorClasses[order.status]}>
                  {order.status_label}
                </Badge>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="text-muted-foreground text-xs">
                  {formatDate(order.placed_at)}
                </p>
              </TableCell>

              <TableCell className="px-4 py-3 space-x-2">
                {order.status !== "cancelled" && (
                  <ChangeStatus startIndex={statusIndex} orderId={order.id} />
                )}

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
