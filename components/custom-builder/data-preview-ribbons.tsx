"use client";

import { toast } from "sonner";
import { useState } from "react";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import DeleteBtn from "../reusable/delete-btn";
import { Ribbon } from "@/types/custom-builder";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import CreateEditRibbon from "./create-edit-ribbon";
import { deleteRibbonAction } from "@/lib/templates";
import { useLocale, useTranslations } from "next-intl";
import { ribbonsColumns } from "@/constants/custom-builder";
import { usePermissions } from "@/providers/permission-providers";

export default function DataPreviewRibbons({
  ribbons,
  pagination,
}: {
  ribbons: Ribbon[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("CustomBuilder.Ribbons");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <CreateEditRibbon />
        </div>

        <DataTable
          columns={ribbonsColumns(t)}
          rowsCount={ribbons.length}
          countUnit={t("Ribbons")}
          pagination={pagination}
        >
          {ribbons.length === 0 ? (
            <TableRow className="border-primary/20">
              <TableCell
                colSpan={ribbonsColumns(t).length + 1}
                className="px-4 py-3"
              >
                <p className="text-center text-sm text-muted-foreground">
                  {t("NoRibbons")}
                </p>
              </TableCell>
            </TableRow>
          ) : (
            ribbons.map((ribbon, index) => (
              <TableRow key={index} className="border-primary/20">
                <TableCell className="px-4 py-3">
                  <p className="font-semibold">{ribbon.name[locale]}</p>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-6 rounded-full"
                      style={{ backgroundColor: ribbon.color_hex }}
                    ></span>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-3">
                  <p className="text-xs font-semibold">
                    {tCommon("AED")} {ribbon.price}
                  </p>
                </TableCell>

                <TableCell className="px-4 py-3 space-x-2">
                  <CreateEditRibbon ribbon={ribbon} trigger={<EditBtn />} />

                  {can("catalog.delete") && (
                    <DeleteBtn
                      itemName={ribbon.name[locale]}
                      onDelete={async () => {
                        setLoadingDelete(true);
                        const result = await deleteRibbonAction(ribbon);
                        setLoadingDelete(false);
                        if (result.success) {
                          toast.success(result.message);
                          return;
                        }
                        toast.error(tCommon("DeleteFailed"));
                      }}
                      loading={loadingDelete}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </DataTable>
      </div>
    </>
  );
}
