"use client";

import { useState } from "react";
import CreateEdit from "./create-edit";
import { Flower } from "@/types/custom-builder";
import { TableCell } from "@/components/ui/table";
import EditBtn from "@/components/reusable/edit-btn";
import DeleteBtn from "@/components/reusable/delete-btn";
import { flowerColumns } from "@/constants/custom-builder";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";

export default function DataPreview({
  initialFlowers,
}: {
  initialFlowers: Flower[];
}) {
  const [flowers, setFlowers] = useState<Flower[]>(initialFlowers);

  return (
    <ReorderableDataTable
      data={flowers}
      getRowId={(row) => row.id}
      onReorder={(newFlowers) => {
        setFlowers(newFlowers);
      }}
      rowsCount={flowers.length}
      countUnit="flowers"
      columns={flowerColumns}
      renderCells={(flower) => (
        <>
          <TableCell className="px-4 py-3 text-sm font-medium">
            {flower.name}
          </TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">
            <CreateEdit flower={flower} trigger={<EditBtn />} />
            <DeleteBtn />
          </TableCell>
        </>
      )}
    />
  );
}
