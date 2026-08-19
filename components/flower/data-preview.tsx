"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "../ui/badge";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types/products";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import { columns } from "@/constants/flowers";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import ModuleHeader from "../reusable/module-header";
import { useLocale, useTranslations } from "next-intl";
import { deleteProductAction } from "@/lib/products-actions";
import { usePermissions } from "@/providers/permission-providers";

export default function DataPreview({
  flowers,
  pagination,
  firstCategoryId,
}: {
  flowers: Product[];
  pagination: Pagination;
  firstCategoryId: number;
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("Flower");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        <CreateEdit firstCategoryId={firstCategoryId} />
      </ModuleHeader>

      <DataTable
        columns={columns(t)}
        rowsCount={flowers.length}
        countUnit={t("Flowers")}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {flowers.map((flower, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>

            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-2">
                {flower.images.length > 0 ? (
                  <Image
                    src={flower.images[0].url as string}
                    alt={flower.name[locale]}
                    width={40}
                    height={40}
                    className="rounded-md shadow-sm w-auto h-auto"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-primary/10 grid place-content-center">
                    {flower.name[locale].charAt(0).toUpperCase()}
                  </div>
                )}
                <p className="font-medium">{flower.name[locale]}</p>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              {flower.variants[0].available_stock}
            </TableCell>

            <TableCell className="px-4 py-3">-</TableCell>

            <TableCell className="px-4 py-3">
              {flower.variants[0].price} {tCommon("AED")}
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge>
                {flower.variants[0].in_stock ? t("InStock") : t("OutOfStock")}
              </Badge>
            </TableCell>

            <TableCell className="px-4 py-3">-</TableCell>

            <TableCell className="px-4 py-3">
              {can("catalog.edit") && (
                <CreateEdit
                  flower={flower}
                  trigger={<EditBtn />}
                  firstCategoryId={firstCategoryId}
                />
              )}

              {can("catalog.delete") && (
                <DeleteBtn
                  onDelete={async () => {
                    setLoadingDelete(true);
                    const result = await deleteProductAction(flower);
                    setLoadingDelete(false);
                    if (result.success) {
                      toast.success(tCommon("DeletedSuccessfully"));
                      return;
                    }
                    toast.error(tCommon("DeleteFailed"));
                  }}
                  loading={loadingDelete}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
