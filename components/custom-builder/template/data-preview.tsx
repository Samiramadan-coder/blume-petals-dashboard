"use client";

import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";
import CreateEdit from "./create-edit";
import { TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Template } from "@/types/custom-builder";
import { useState } from "react";
import { columns } from "@/constants/custom-builder";

export default function DataPreview({
  initialTemplates,
}: {
  initialTemplates: Template[];
}) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);

  return (
    <ReorderableDataTable
      data={templates}
      getRowId={(row) => row.id}
      onReorder={(newTemplates) => {
        setTemplates(newTemplates);
      }}
      rowsCount={templates.length}
      countUnit="templates"
      columns={columns}
      renderCells={(template) => (
        <>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">-</TableCell>
          <TableCell className="px-4 py-3">
            <CreateEdit
              template={template}
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
