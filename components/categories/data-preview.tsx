"use client";

import {
  deleteCategoryAction,
  reorderCategoriesAction,
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
import { useQueryParam } from "@/hooks/use-search-params";
import { ReorderableDataTable } from "../reusable/date-sortable-table";
import Image from "next/image";
import { Spinner } from "../ui/spinner";

export default function DataPreview({
  pagination,
  initialCategories,
}: {
  pagination: Pagination;
  initialCategories: Category[];
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
        <CreateEdit totalCreatedItems={pagination.total} />
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
        onReorder={async (newCategories) => {
          setCategories(newCategories);
          const result = await reorderCategoriesAction(
            newCategories.map((category) => category.id),
          );
          if (result.success) {
            toast.success(tCommon("ReorderedSuccessfully"));
            return;
          }
          toast.error(tCommon("ReorderFailed"));
        }}
        renderCells={(category) => (
          <>
            <TableCell className="px-4 py-3">
              <div className="flex gap-4">
                <Image
                  src={category.banner_url as string}
                  alt={category.name[locale]}
                  width={40}
                  height={60}
                  className="rounded-md shadow-sm"
                />
                <div>
                  <p className="font-semibold">{category.name[locale]}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    /{category.slug}
                  </p>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-semibold">
                - <span className="font-normal">{t("Items")}</span>
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <VisibilitySwitch category={category} />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-secondary/20 text-secondary">
                {category.is_visible ? tCommon("Visible") : tCommon("Hidden")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                category={category}
                trigger={<EditBtn />}
                totalCreatedItems={pagination.total}
              />

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

/**
 * A switch component to toggle the visibility of a category.
 */
function VisibilitySwitch({ category }: { category: Category }) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={category.is_visible}
          onClick={async () => {
            setLoading(true);
            const result = await updateCategoryVisibilityAction(category);
            setLoading(false);
            if (result.success) {
              toast.success(tCommon("VisibilityUpdated"));
              return;
            }
            toast.error(tCommon("VisibilityUpdateFailed"));
          }}
        />
      )}
    </>
  );
}
