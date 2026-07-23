"use client";

import { Order } from "@/types/orders";
import { Checkbox } from "../ui/checkbox";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { columns } from "@/constants/orders";
import FiltersControl from "./filters-control";
import { ChangeStatus } from "./change-status";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { orderStatuses } from "@/constants/orders";
import { useQueryParam } from "@/hooks/use-search-params";

export default function DataPreview({
  orders,
  pagination,
}: {
  orders: Order[];
  pagination: Pagination;
}) {
  const t = useTranslations("Orders");
  const { setQueryParam } = useQueryParam();

  return (
    <>
      <FiltersControl />

      <DataTable
        columns={columns(t)}
        rowsCount={orders.length}
        countUnit={t("Label")}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onCheckboxChange={(checked) => console.log(checked)}
        onPageChange={(page) => setQueryParam("page", page.toString())}
      >
        {orders.map((order, index) => {
          const statusIndex = orderStatuses(t).findIndex(
            (status) => status.value === order.status,
          );

          // console.log("statusIndex", statusIndex);

          return (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <Checkbox />
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.order_number}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.customer.name}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.items.length}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.summary.grand_total}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.fulfillment_method}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.status_label}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                <p>{order.placed_at.split("T")[0]}</p>
              </TableCell>

              <TableCell className="px-4 py-3">
                {order.status !== "cancelled" && (
                  <ChangeStatus startIndex={statusIndex} orderId={order.id} />
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </DataTable>
    </>
  );
}
