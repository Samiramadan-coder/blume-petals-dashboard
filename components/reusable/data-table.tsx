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
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { useTranslations } from "next-intl";

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
  onNextPage: () => void;
  onPreviousPage: () => void;
}

export function DataTable({
  columns,
  rowsCount,
  countUnit,
  children,
  onCheckboxChange,
  onNextPage,
  onPreviousPage,
}: DataTableProps) {
  const t = useTranslations("Common");

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-4">
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
            <TableCell
              className="px-4 py-3 text-sm text-muted-foreground"
              colSpan={columns.length}
            >
              {t("Showing")}{" "}
              <span className="font-semibold text-black">{rowsCount}</span>{" "}
              {countUnit}
            </TableCell>
            <TableCell className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={onPreviousPage}
                >
                  {t("Previous")}
                </Button>
                <Button className="text-sm min-w-8">1</Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={onNextPage}
                >
                  {t("Next")}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
