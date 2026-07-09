"use client";

import { columns } from "@/constants/customers";
import { DataTable } from "../reusable/data-table";
import FiltersControl from "./filters-control";
import { TableCell, TableRow } from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { Customer } from "@/types/customers";

export default function DataPreview({ customers }: { customers: Customer[] }) {
  return (
    <>
      <FiltersControl />

      <DataTable
        columns={columns}
        rowsCount={customers.length}
        countUnit="customers"
        onNextPage={() => {
          console.log("Next page clicked");
        }}
        onPreviousPage={() => {
          console.log("Previous page clicked");
        }}
        onCheckboxChange={(checked) =>
          console.log("Checkbox changed:", checked)
        }
      >
        {customers.map((customer, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">
              <Button variant="ghost">
                <Eye className="text-muted-foreground" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
