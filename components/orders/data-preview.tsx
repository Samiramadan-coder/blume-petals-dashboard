"use client";

import { Order } from "@/types/orders";
import { Checkbox } from "../ui/checkbox";
import { Pagination } from "@/types/shared";
import { columns } from "@/constants/orders";
import FiltersControl from "./filters-control";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { useQueryParam } from "@/hooks/use-search-params";

export default function DataPreview({
  orders,
  pagination,
}: {
  orders: Order[];
  pagination: Pagination;
}) {
  const { setQueryParam } = useQueryParam();
  return (
    <>
      <FiltersControl />

      <DataTable
        columns={columns}
        rowsCount={orders.length}
        countUnit="orders"
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onPageChange={(page) => setQueryParam("page", page.toString())}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {orders.map((order, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>
            <TableCell className="px-4 py-3">{order.order_number}</TableCell>
            <TableCell className="px-4 py-3">{order.customer.name}</TableCell>
            <TableCell className="px-4 py-3">{order.items.length}</TableCell>
            <TableCell className="px-4 py-3">
              {order.summary.grand_total}
            </TableCell>
            <TableCell className="px-4 py-3">
              {order.fulfillment_method}
            </TableCell>
            <TableCell className="px-4 py-3">{order.status_label}</TableCell>
            <TableCell className="px-4 py-3">
              {order.placed_at.split("T")[0]}
            </TableCell>
            <TableCell className="px-4 py-3">
              -
              {/* <Button variant="ghost">
                <Eye className="text-muted-foreground" />
              </Button> */}
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
