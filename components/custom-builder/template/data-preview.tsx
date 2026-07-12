"use client";

import { useState } from "react";
import CreateEdit from "./create-edit";
import { Template } from "@/types/custom-builder";
import { TableCell } from "@/components/ui/table";
import EditBtn from "@/components/reusable/edit-btn";
import { columns } from "@/constants/custom-builder";
import DeleteBtn from "@/components/reusable/delete-btn";
import { ReorderableDataTable } from "@/components/reusable/date-sortable-table";

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
            <CreateEdit template={template} trigger={<EditBtn />} />
            <DeleteBtn />
          </TableCell>
        </>
      )}
    />
  );
}
