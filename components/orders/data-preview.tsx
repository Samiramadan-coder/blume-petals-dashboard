"use client";

import { Eye } from "lucide-react";
import { DataTable } from "../reusable/data-table";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { TableCell, TableRow } from "../ui/table";
import FiltersControl from "./filters-control";
import { columns, ordersPlaceholder } from "@/constants/orders";

export default function DataPreview() {
  return (
    <>
      <FiltersControl />

      <DataTable
        columns={columns}
        rowsCount={ordersPlaceholder.length}
        countUnit="orders"
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
        {ordersPlaceholder.map((order, index) => (
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
