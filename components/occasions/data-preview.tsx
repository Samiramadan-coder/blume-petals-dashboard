"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import EditBtn from "../reusable/edit-btn";
import DeleteBtn from "../reusable/delete-btn";
import { columns } from "@/constants/occasions";
import { OccasionCollection } from "@/types/occasions";
import { useLocale, useTranslations } from "next-intl";
import { ReorderableDataTable } from "../reusable/date-sortable-table";

export default function DataPreview({
  initialOccasionsCollections,
}: {
  initialOccasionsCollections: OccasionCollection[];
}) {
  const t = useTranslations("Occasions");
  const locale = useLocale();
  const [occasionsCollections, setOccasionsCollections] = useState(
    initialOccasionsCollections,
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn(`text-2xl font-semibold text-foreground`, {
              "font-cairo": locale === "ar",
              "font-heading": locale === "en",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
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
        columns={columns(t)}
        renderCells={(occasionCollection) => (
          <>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">
              <CreateEdit occasion={occasionCollection} trigger={<EditBtn />} />
              <DeleteBtn />
            </TableCell>
          </>
        )}
      />
    </>
  );
}
