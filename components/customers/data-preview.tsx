"use client";

import Image from "next/image";
import { User } from "@/types/customers";
import { formatDate } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Pagination } from "@/types/shared";
import FiltersControl from "./filters-control";
import { columns } from "@/constants/customers";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import CellDataNotFound from "../reusable/cell-data-not-found";

export default function DataPreview({
  initialCustomers,
  pagination,
}: {
  initialCustomers: User[];
  pagination: Pagination;
}) {
  const t = useTranslations("Customers");

  return (
    <>
      <FiltersControl />

      <DataTable
        columns={columns(t)}
        rowsCount={initialCustomers.length}
        countUnit={t("Title")}
        pagination={pagination}
      >
        {initialCustomers.map((customer, index) => (
          <TableRow key={index} className="border-primary/20">
            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-4">
                {customer.photo_url ? (
                  <Image
                    src={customer.photo_url}
                    alt={customer.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center bg-primary/30 rounded-full">
                    {customer.name.slice(0, 1)}
                  </div>
                )}

                <p className="font-medium">{customer.name}</p>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground">
                {customer.email || <CellDataNotFound />}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground tracking-[1px]">
                {customer.phone || <CellDataNotFound />}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-bold">{customer.orders_count}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-bold">{customer.total_spent}</p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground text-xs">
                {customer.last_order_at ? (
                  formatDate(customer.last_order_at)
                ) : (
                  <CellDataNotFound />
                )}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="text-muted-foreground text-xs">
                {formatDate(customer.created_at)}
              </p>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
