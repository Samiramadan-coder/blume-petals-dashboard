"use client";

import { useState } from "react";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { columns } from "@/constants/occasions-collections";
import { OccasionCollection } from "@/types/occasions-collections";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function DataPreview({
  initialOccasionsCollections,
}: {
  initialOccasionsCollections: OccasionCollection[];
}) {
  const [occasionsCollections, setOccasionsCollections] = useState(
    initialOccasionsCollections,
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Occasions Collections
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Organise your products and control what appears on the storefront.
          </p>
        </div>
        <CreateEdit />
      </header>

      <ReorderableDataTable
        data={occasionsCollections}
        getRowId={(row) => row.id}
        onReorder={(newOccasionsCollections) => {
          setOccasionsCollections(newOccasionsCollections);
        }}
        rowsCount={occasionsCollections.length}
        countUnit="occasions collections"
        columns={columns}
        renderCells={(occasionCollection) => (
          <>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">
              <CreateEdit
                occasion={occasionCollection}
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
    </>
  );
}
