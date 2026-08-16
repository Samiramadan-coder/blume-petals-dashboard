"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Statistics from "./statistics";
import { Button } from "../ui/button";
import CreateEdit from "./create-edit";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { DataTable } from "../reusable/data-table";
import ModuleHeader from "../reusable/module-header";

export default function DataPreview() {
  const t = useTranslations("Flower");

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit />
      </ModuleHeader>

      <Statistics />

      <DataTable
        columns={[{ label: "Test1" }, { label: "Test2" }]}
        countUnit={"Flowers"}
        rowsCount={10}
      >
        <TableRow>
          <TableCell className="px-4 py-3">Test1</TableCell>
          <TableCell className="px-4 py-3">Test2</TableCell>
        </TableRow>

        <TableRow className="bg-white">
          <TableCell colSpan={2}>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Stock Log —</h3>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5" />
                  Download Stock Log
                </Button>
              </div>

              <div className="overflow-hidden rounded-lg border bg-background">
                <Table>
                  <TableHeader className="bg-background">
                    <TableRow>
                      <TableHead className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground">
                        Date
                      </TableHead>
                      <TableHead className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground">
                        Action
                      </TableHead>
                      <TableHead className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground">
                        Change
                      </TableHead>
                      <TableHead className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground">
                        Balance
                      </TableHead>
                      <TableHead className="px-4 py-3 uppercase text-xs font-semibold text-muted-foreground">
                        Note
                      </TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody className="bg-white">
                    {true ? (
                      [1, 2, 3].map((log, index) => (
                        <TableRow key={index}>
                          <TableCell className="px-4 py-3">-</TableCell>
                          <TableCell className="px-4 py-3">-</TableCell>
                          <TableCell className="px-4 py-3">-</TableCell>
                          <TableCell className="px-4 py-3">-</TableCell>
                          <TableCell className="px-4 py-3">—</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-20 text-center text-muted-foreground"
                        >
                          No stock logs
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TableCell>
        </TableRow>
      </DataTable>
    </>
  );
}
