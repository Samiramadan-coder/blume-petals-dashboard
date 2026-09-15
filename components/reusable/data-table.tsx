import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import PaginationTemplate from "./pagination-temlate";
import { Pagination } from "@/types/shared";

export type SortDirection = "asc" | "desc";

export type DataTableColumn = {
  label: string;
  className?: string;
  sortKey?: string;
};

interface DataTableProps {
  columns: DataTableColumn[];
  rowsCount: number;
  countUnit: string;
  children: React.ReactNode;
  onCheckboxChange?: (checked: boolean) => void;
  pagination?: Pagination;
  isCheckbox?: boolean;

  sortBy?: string | null;
  sortDirection?: SortDirection;
  onSort?: (sortKey: string) => void;
}

export function DataTable({
  columns,
  rowsCount,
  countUnit,
  children,
  onCheckboxChange,
  pagination,
  isCheckbox,
  sortBy,
  sortDirection,
  onSort,
}: DataTableProps) {
  const t = useTranslations("Common");

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg border border-primary/20">
      <Table
        className={cn(
          onCheckboxChange &&
            "[&_thead_th:first-child]:w-8 [&_thead_th:first-child]:px-3 [&_tbody_td:first-child]:w-8 [&_tbody_td:first-child]:px-3",
        )}
      >
        <TableHeader>
          <TableRow className="border-primary/20">
            {onCheckboxChange && (
              <TableHead className="w-8 px-3 py-4">
                <Checkbox
                  onCheckedChange={onCheckboxChange}
                  checked={isCheckbox}
                />
              </TableHead>
            )}

            {columns.map((column) => {
              const isSortable = Boolean(column.sortKey);
              const isActive = sortBy === column.sortKey;

              return (
                <TableHead
                  key={column.sortKey ?? column.label}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase text-muted-foreground",
                    column.className,
                  )}
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (column.sortKey) {
                          onSort?.(column.sortKey);
                        }
                      }}
                      className="flex items-center gap-2 transition-colors hover:text-foreground"
                    >
                      <span>{column.label}</span>

                      {!isActive && <ArrowUpDown className="size-3.5" />}

                      {isActive && sortDirection === "asc" && (
                        <ArrowUp className="size-3.5" />
                      )}

                      {isActive && sortDirection === "desc" && (
                        <ArrowDown className="size-3.5" />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody className="bg-white">{children}</TableBody>
      </Table>

      <div className="flex items-center justify-between border-t border-primary/20 bg-white p-4">
        <div className="whitespace-nowrap text-xs text-muted-foreground">
          {!pagination ? (
            <p>
              {t("Showing")} <span>{rowsCount}</span> {countUnit}
            </p>
          ) : (
            <p>
              {t("Showing")}
              <span className="mx-1">{pagination.from}</span>
              {t("To")}
              <span className="mx-1">{pagination.to}</span>
              {t("Of")}
              <span className="mx-1">{pagination.total}</span>
              {countUnit}
            </p>
          )}
        </div>

        {pagination && (
          <PaginationTemplate
            currentPage={pagination.current_page}
            totalPages={pagination.last_page}
          />
        )}
      </div>
    </div>
  );
}
