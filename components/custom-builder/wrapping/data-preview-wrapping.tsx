"use client";

import { useState } from "react";
import CreateEditWrapping from "./create-edit-wrapping";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wrapping } from "@/types/custom-builder";
import { TableCell } from "@/components/ui/table";
import { wrappingColumns } from "@/constants/custom-builder";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";

export default function DataPreviewWrapping({
  initialWrappings,
}: {
  initialWrappings: Wrapping[];
}) {
  const [wrappings, setWrappings] = useState<Wrapping[]>(initialWrappings);

  return (
    <ReorderableDataTable
      data={wrappings}
      getRowId={(row) => row.id}
      onReorder={(newWrappings) => {
        setWrappings(newWrappings);
      }}
      rowsCount={wrappings.length}
      countUnit="wrappings"
      columns={wrappingColumns}
      renderCells={(wrapping) => (
        <>
          <TableCell className="px-4 py-3 text-sm font-medium">
            {wrapping.name}
          </TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">
            <CreateEditWrapping
              wrapping={wrapping}
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer"
                >
                  <Pencil className="text-muted-foreground" />
                </Button>
              }
            />
            <Button variant="ghost" className="cursor-pointer">
              <Trash2 className="text-muted-foreground" />
            </Button>
          </TableCell>
        </>
      )}
    />
  );
}
