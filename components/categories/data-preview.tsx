"use client";

import { useState } from "react";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import { Category } from "@/types/categories";
import { columns } from "@/constants/categories";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { Button } from "../ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function DataPreview({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const t = useTranslations("Categories");
  const locale = useLocale();

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn("text-2xl font-semibold text-foreground", {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {t("Categories")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("CategoriesBrief")}
          </p>
        </div>
        <CreateEdit />
      </header>

      <ReorderableDataTable
        data={categories}
        getRowId={(row) => row.id}
        onReorder={(newCategories) => {
          setCategories(newCategories);
        }}
        rowsCount={categories.length}
        countUnit={t("Categories")}
        columns={columns((key) => t(key as never))}
        renderCells={(category) => (
          <>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">-</TableCell>
            <TableCell className="px-4 py-3">
              <CreateEdit
                category={category}
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
