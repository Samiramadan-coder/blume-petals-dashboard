import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

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
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table className="">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-3">
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
              className="px-4 py-3 text-xs text-muted-foreground"
              colSpan={columns.length}
            >
              Showing{" "}
              <span className="font-semibold text-black">{rowsCount}</span>{" "}
              {countUnit}
            </TableCell>
            <TableCell className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={onPreviousPage}
                >
                  Previous
                </Button>
                <Button className="text-xs min-w-8">1</Button>
                <Button
                  variant="outline"
                  className="text-xs"
                  onClick={onNextPage}
                >
                  Next
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
