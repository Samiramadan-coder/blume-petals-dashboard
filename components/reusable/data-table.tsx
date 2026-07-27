import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";
import PaginationTemplate from "./pagination-temlate";

export type DataTableColumn = {
  label: string;
  className?: string;
};

interface DataTableProps {
  columns: DataTableColumn[];
  rowsCount: number;
  countUnit: string;
  children: React.ReactNode;
  onCheckboxChange: (checked: boolean) => void;
  currentPage?: number;
  totalPages?: number;
}

export function DataTable({
  columns,
  rowsCount,
  countUnit,
  children,
  onCheckboxChange,
  currentPage,
  totalPages,
}: DataTableProps) {
  const t = useTranslations("Common");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table className="[&_thead_th:first-child]:w-8 [&_thead_th:first-child]:px-3 [&_tbody_td:first-child]:w-8 [&_tbody_td:first-child]:px-3">
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 px-3 py-4">
              <Checkbox onCheckedChange={onCheckboxChange} />
            </TableHead>

            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={cn(
                  "px-4 py-3 uppercase text-xs font-semibold text-muted-foreground",
                  column.className,
                )}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">{children}</TableBody>
        <TableFooter className="bg-white">
          <TableRow>
            <TableCell className="px-4 py-3 text-sm text-muted-foreground">
              {t("Showing")}{" "}
              <span className="font-semibold text-black">{rowsCount}</span>{" "}
              {countUnit}
            </TableCell>

            <TableCell className="px-4 py-3" colSpan={columns.length}>
              {totalPages && currentPage && (
                <PaginationTemplate
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
