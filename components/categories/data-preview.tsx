"use client";

import {
  deleteCategoryAction,
  updateCategoryVisibilityAction,
} from "@/lib/categories-actions";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import CreateEdit from "./create-edit";
import { TableCell } from "../ui/table";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import { Category } from "@/types/categories";
import DeleteBtn from "../reusable/delete-btn";
import { columns } from "@/constants/categories";
import { useLocale, useTranslations } from "next-intl";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import { useQueryParam } from "@/hooks/use-search-params";

export default function DataPreview({
  initialCategories,
  pagination,
}: {
  initialCategories: Category[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const t = useTranslations("Categories");
  const { setQueryParam } = useQueryParam();
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [categories, setCategories] = useState(initialCategories);

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
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onPageChange={(page) => setQueryParam("page", page.toString())}
        rowsCount={categories.length}
        countUnit={t("Categories")}
        columns={columns((key) => t(key as never))}
        onReorder={(newCategories) => {
          setCategories(newCategories);
        }}
        renderCells={(category) => (
          <>
            <TableCell className="px-4 py-3">
              <p className="font-semibold">{category.name[locale]}</p>
              <p className="text-muted-foreground text-xs mt-1">
                /{category.slug}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-semibold">
                24 <span className="font-normal">{t("Items")}</span>
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Switch
                checked={category.is_visible}
                onClick={async () => {
                  const result = await updateCategoryVisibilityAction(category);

                  if (result.success) {
                    toast.success(tCommon("VisibilityUpdated"));
                    return;
                  }

                  toast.error(tCommon("VisibilityUpdateFailed"));
                }}
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-secondary/20 text-secondary">
                {category.is_visible ? tCommon("Visible") : tCommon("Hidden")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit category={category} trigger={<EditBtn />} />
              <DeleteBtn
                onDelete={async () => {
                  setLoadingDelete(true);
                  const result = await deleteCategoryAction(category);

                  setLoadingDelete(false);

                  if (result.success) {
                    toast.success(tCommon("DeletedSuccessfully"));
                    return;
                  }

                  toast.error(tCommon("DeleteFailed"));
                }}
                loading={loadingDelete}
              />
            </TableCell>
          </>
        )}
      />
    </>
  );
}
