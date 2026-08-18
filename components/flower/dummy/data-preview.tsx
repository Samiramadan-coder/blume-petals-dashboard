"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useState } from "react";
import Statistics from "./statistics";
import { Button } from "../../ui/button";
import CreateEdit from "./create-edit";
import { useTranslations } from "next-intl";
import { columns } from "@/constants/flowers";
import { DataTable } from "../../reusable/data-table";
import ModuleHeader from "../../reusable/module-header";
import { Download, ChevronDown, ChevronRight } from "lucide-react";

export default function DataPreview() {
  const t = useTranslations("Flower");

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit />
      </ModuleHeader>

      <Statistics />

      <DataTable columns={columns(t)} countUnit={"Flowers"} rowsCount={10}>
        <SingleRow />
        <SingleRow />
        <SingleRow />
        <SingleRow />
      </DataTable>
    </>
  );
}

const SingleRow = () => {
  const t = useTranslations("Flower");
  const [open, setOpen] = useState(false);

  const columns = [
    t("DetailsTable.Date"),
    t("DetailsTable.Action"),
    t("DetailsTable.Change"),
    t("DetailsTable.Balance"),
    t("DetailsTable.Note"),
  ];

  return (
    <>
      <TableRow>
        <TableCell className="px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )}
          </Button>
        </TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
        <TableCell className="px-4 py-3">.....</TableCell>
      </TableRow>

      {open && (
        <TableRow className="bg-background">
          <TableCell colSpan={7}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">
                  {t("DetailsTable.StockLog")} —
                </h3>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5" />
                  {t("DetailsTable.Download")}
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border bg-background">
                <Table>
                  <TableHeader className="bg-background">
                    <TableRow>
                      {columns.map((column, index) => (
                        <TableHead
                          key={index}
                          className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground"
                        >
                          {column}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody className="bg-white">
                    {true ? (
                      [1, 2, 3].map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-4 py-3">.....</TableCell>
                          <TableCell className="px-4 py-3">.....</TableCell>
                          <TableCell className="px-4 py-3">.....</TableCell>
                          <TableCell className="px-4 py-3">.....</TableCell>
                          <TableCell className="px-4 py-3">.....</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-20 text-center text-muted-foreground"
                        >
                          {t("DetailsTable.NoStockLog")}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
