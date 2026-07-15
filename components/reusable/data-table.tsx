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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

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
  onPageChange?: (page: number) => void;
}

function getVisiblePages(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis-end", totalPages] as const;
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis-start",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ] as const;
  }

  return [
    1,
    "ellipsis-start",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis-end",
    totalPages,
  ] as const;
}

export function DataTable({
  columns,
  rowsCount,
  countUnit,
  children,
  onCheckboxChange,
  currentPage,
  totalPages,
  onPageChange,
}: DataTableProps) {
  const t = useTranslations("Common");

  const visiblePages =
    currentPage && totalPages ? getVisiblePages(currentPage, totalPages) : [];

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

            <TableCell className="px-4 py-3" colSpan={columns.length - 1}>
              {onPageChange && totalPages && currentPage && (
                <Pagination className="justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        text={t("Previous")}
                        aria-label={t("Previous")}
                        onClick={(event) => {
                          event.preventDefault();

                          if (currentPage > 1) {
                            onPageChange(currentPage - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {visiblePages.map((item) =>
                      typeof item === "number" ? (
                        <PaginationItem key={item}>
                          <PaginationLink
                            href="#"
                            isActive={item === currentPage}
                            aria-label={`${t("Showing")} ${item}`}
                            onClick={(event) => {
                              event.preventDefault();
                              onPageChange(item);
                            }}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={item}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ),
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        text={t("Next")}
                        aria-label={t("Next")}
                        onClick={(event) => {
                          event.preventDefault();

                          if (currentPage < totalPages) {
                            onPageChange(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
