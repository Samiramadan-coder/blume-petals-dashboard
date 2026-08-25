"use client";

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
import { deleteProductAction } from "@/lib/products";
import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Link } from "@/i18n/navigation";
import { Button } from "../ui/button";
import { Images } from "lucide-react";

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
        pagination={pagination}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {flowers.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns(t).length + 1} className="px-4 py-3">
              <p className="text-center text-sm text-muted-foreground">
                {t("NoFlowers")}
              </p>
            </TableCell>
          </TableRow>
        ) : (
          flowers.map((flower, index) => (
            <TableRow key={index}>
              <TableCell className="px-4 py-3">
                <Checkbox />
              </TableCell>

              <TableCell className="px-4 py-3">
                <div className="w-10 h-10 font-semibold rounded-lg bg-primary/20 grid place-content-center uppercase">
                  {flower.name[locale].slice(0, 2)}
                </div>
              </TableCell>

              <TableCell className="px-4 py-3">
                <div>
                  <p className="mb-1 font-semibold">{flower.name[locale]}</p>
                  <span className="text-muted-foreground text-xs">
                    {flower.sku}
                  </span>
                </div>
              </TableCell>

              <TableCell className="px-4 py-3 font-bold">
                {flower.variants[0].available_stock}
              </TableCell>

              <TableCell className="px-4 py-3 text-muted-foreground text-xs">
                {tCommon("AED")} {flower.price_from}
              </TableCell>

              <TableCell className="px-4 py-3">
                <Badge
                  className={
                    flower.variants[0].in_stock
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-destructive/10 text-destructive border border-destructive/50"
                  }
                >
                  {flower.variants[0].in_stock ? t("InStock") : t("OutOfStock")}
                </Badge>
              </TableCell>

              <TableCell className="px-4 py-3">
                {can("catalog.edit") && (
                  <CreateEdit
                    flower={flower}
                    trigger={<EditBtn />}
                    firstCategoryId={firstCategoryId}
                  />
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/products/${flower.id}`} locale={locale}>
                      <Button variant="ghost">
                        <Images className="size-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{t("Gallery")}</TooltipContent>
                </Tooltip>

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
          ))
        )}
      </DataTable>
    </>
  );
}
