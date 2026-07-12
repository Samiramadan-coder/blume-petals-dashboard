"use client";

import { useState } from "react";
import { Wrapping } from "@/types/custom-builder";
import { TableCell } from "@/components/ui/table";
import EditBtn from "@/components/reusable/edit-btn";
import CreateEditWrapping from "./create-edit-wrapping";
import DeleteBtn from "@/components/reusable/delete-btn";
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
            <CreateEditWrapping wrapping={wrapping} trigger={<EditBtn />} />
            <DeleteBtn />
          </TableCell>
        </>
      )}
    />
  );
}
