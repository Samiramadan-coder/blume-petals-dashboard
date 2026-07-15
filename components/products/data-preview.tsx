"use client";

import Image from "next/image";
import Statistics from "./statistics";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Product } from "@/types/products";
import EditBtn from "../reusable/edit-btn";
import { useLocale, useTranslations } from "next-intl";
import FiltersControl from "./filters-control";
import { columns } from "@/constants/products";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import { DataTable } from "../reusable/data-table";
import { Switch } from "../ui/switch";
import { Star } from "lucide-react";
import { Badge } from "../ui/badge";
import { Category } from "@/types/categories";
import { Occasion } from "@/types/occasions";
import { toast } from "sonner";
import {
  deleteProductAction,
  updateProductStatusAction,
} from "@/lib/products-actions";
import { useState } from "react";
import { Pagination } from "@/types/shared";
import { useQueryParam } from "@/hooks/use-search-params";

export default function DataPreview({
  products,
  categories,
  occasions,
  pagination,
}: {
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const t = useTranslations("Products");
  const { setQueryParam } = useQueryParam();
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between">
        <FiltersControl categories={categories} />
        <CreateEdit categories={categories} occasions={occasions} />
      </header>

      <Statistics />

      <DataTable
        columns={columns(t)}
        rowsCount={products.length}
        countUnit={t("Products")}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onPageChange={(page) => setQueryParam("page", page.toString())}
        onCheckboxChange={(checked) => console.log(checked)}
      >
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>

            <TableCell className="px-4 py-3">
              <Image
                src={product.images[0].url as string}
                alt={product.name[locale]}
                width={60}
                height={80}
                className="rounded-md shadow-sm"
              />
            </TableCell>

            <TableCell className="px-4 py-3">
              <p className="font-semibold">{product.name[locale]}</p>
              <p className="text-muted-foreground text-xs mt-1">
                {product.sku}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <span className="text-muted-foreground">
                {
                  categories.find(
                    (category) => category.id === product.category_id,
                  )?.name[locale]
                }
              </span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <span className="font-semibold">{product.variants[0].price}</span>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Badge className="bg-primary/30 text-primary">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary"></span>{" "}
                {product.variants[0].in_stock
                  ? t("Labels.InStock")
                  : t("Labels.OutOfStock")}
              </Badge>
              <p className="text-muted-foreground text-xs mt-2">
                {product.variants[0].stock} {t("Labels.Units")}
              </p>
            </TableCell>

            <TableCell className="px-4 py-3">
              <div className="flex items-center gap-1">
                <Star className="size-2.5 text-primary fill-primary" />
                <span className="font-semibold text-xs">
                  {product.rating_avg}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({product.rating_count})
                </span>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <Switch
                checked={product.status === "published"}
                onClick={async () => {
                  const result = await updateProductStatusAction(product);
                  if (result.success) {
                    toast.success(tCommon("VisibilityUpdated"));
                    return;
                  }
                  toast.error(tCommon("VisibilityUpdateFailed"));
                }}
              />
            </TableCell>

            <TableCell className="px-4 py-3 text-center">
              <CreateEdit
                categories={categories}
                occasions={occasions}
                product={product}
                trigger={<EditBtn />}
              />

              <DeleteBtn
                onDelete={async () => {
                  setLoadingDelete(true);
                  const result = await deleteProductAction(product);
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
          </TableRow>
        ))}
      </DataTable>
    </>
  );
}
