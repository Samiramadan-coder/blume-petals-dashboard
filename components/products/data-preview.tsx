"use client";

import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import Statistics from "./statistics";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Link } from "@/i18n/navigation";
import { Checkbox } from "../ui/checkbox";
import EditBtn from "../reusable/edit-btn";
import { Images, Star, Trash2 } from "lucide-react";
import { Pagination } from "@/types/shared";
import { Occasion } from "@/types/occasions";
import { Category } from "@/types/categories";
import FiltersControl from "./filters-control";
import { columns } from "@/constants/products";
import DeleteBtn from "../reusable/delete-btn";
import { TableCell, TableRow } from "../ui/table";
import CreateEdit from "./creat-edit/create-edit";
import { DataTable } from "../reusable/data-table";
import { Product, Summary } from "@/types/products";
import { useLocale, useTranslations } from "next-intl";
import { usePermissions } from "@/providers/permission-providers";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { deleteProductAction, updateProductStatusAction } from "@/lib/products";
import Image from "next/image";

export default function DataPreview({
  products,
  categories,
  occasions,
  pagination,
  type,
  summary,
  flowers,
}: {
  products: Product[];
  categories: Category[];
  occasions: Occasion[];
  pagination: Pagination;
  type: "default" | "addon";
  summary: Summary;
  flowers: Product[];
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  return (
    <>
      <header className="flex items-center justify-between flex-wrap gap-4">
        <FiltersControl categories={categories} />
        {can("catalog.create") && (
          <div className="flex items-center gap-2">
            {checkedIds.length ? (
              <>
                <span className="text-muted-foreground font-semibold text-xs">
                  {checkedIds.length} {tCommon("Selected")}
                </span>
                <DeleteBtn
                  trigger={
                    <Button variant="outline" className="h-10 bg-white">
                      <Trash2 className="text-destructive/70" />
                      <span className="text-destructive">
                        {tCommon("BulkDelete")}
                      </span>
                    </Button>
                  }
                />
              </>
            ) : null}

            <CreateEdit
              categories={categories}
              occasions={occasions}
              type={type}
              flowers={flowers}
            />
          </div>
        )}
      </header>

      <Statistics summary={summary} />

      <DataTable
        columns={columns(t)}
        rowsCount={products.length}
        countUnit={t("Products")}
        pagination={pagination}
        isCheckbox={checkedIds.length === products.length}
        onCheckboxChange={
          can("catalog.delete")
            ? (checked) =>
                setCheckedIds(checked ? products.map((p) => p.id) : [])
            : undefined
        }
      >
        {products.length === 0 ? (
          <TableRow className="border-primary/20">
            <TableCell colSpan={columns(t).length + 1} className="px-4 py-3">
              <p className="text-center text-sm text-muted-foreground">
                {t("NoProducts")}
              </p>
            </TableCell>
          </TableRow>
        ) : (
          products.map((product, index) => (
            <TableRow key={index} className="border-primary/20">
              {can("catalog.delete") && (
                <TableCell className="px-4 py-3">
                  <Checkbox
                    checked={checkedIds.includes(product.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setCheckedIds((prev) => [...prev, product.id]);
                      } else {
                        setCheckedIds((prev) =>
                          prev.filter((id) => id !== product.id),
                        );
                      }
                    }}
                  />
                </TableCell>
              )}

              <TableCell className="px-4 py-3">
                <Image
                  src={product.images.find((img) => img.is_primary)?.url || ""}
                  alt={product.name[locale]}
                  width={40}
                  height={40}
                  className="rounded-lg max-h-10"
                />
              </TableCell>

              <TableCell className="px-4 py-3">
                <p className="font-semibold">
                  {product.name[locale]}
                  {product.is_new && (
                    <Badge className="mx-2 text-[10px] font-semibold text-foreground uppercase">
                      {tCommon("New")}
                    </Badge>
                  )}
                </p>
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
                <div className="space-y-1">
                  {product.variants.map((variant) => (
                    <div key={variant.id}>
                      <span className="text-xs">
                        <span className="text-muted-foreground">
                          {variant.size}:{" "}
                        </span>
                        <span className="font-semibold">{variant.price}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </TableCell>

              <TableCell className="px-4 py-3">
                <div className="space-y-1.5">
                  {product.variants.map((variant) => (
                    <div key={variant.id} className="space-x-1.5">
                      <Badge
                        className={cn(
                          "font-semibold border",
                          variant.in_stock
                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                            : "text-destructive bg-destructive/10 border-destructive/50",
                        )}
                      >
                        {variant.in_stock ? t("In") : t("Out")}
                      </Badge>
                      <span className="text-xs">
                        <span className="text-muted-foreground">
                          {variant.size}:{" "}
                        </span>
                        <span className="font-semibold">
                          {variant.available_stock}{" "}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
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
                <VisibilitySwitch
                  product={product}
                  disabled={!can("catalog.edit")}
                />
              </TableCell>

              <TableCell className="px-4 py-3 text-center">
                {can("catalog.edit") && (
                  <CreateEdit
                    categories={categories}
                    occasions={occasions}
                    product={product}
                    trigger={<EditBtn />}
                    type={type}
                    flowers={flowers}
                  />
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/products/${product.id}`} locale={locale}>
                      <Button variant="ghost">
                        <Images className="size-4 text-muted-foreground" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>{t("Labels.Gallery")}</TooltipContent>
                </Tooltip>

                {can("catalog.delete") && (
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
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </DataTable>
    </>
  );
}

/**
 * A switch component to toggle the visibility of a category.
 */
function VisibilitySwitch({
  product,
  disabled,
}: {
  product: Product;
  disabled?: boolean;
}) {
  const tCommon = useTranslations("Common");
  const tProducts = useTranslations("Products");
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          disabled={disabled}
          checked={product.status === "published"}
          onClick={async () => {
            setLoading(true);
            const result = await updateProductStatusAction(product);
            setLoading(false);

            if (result.success) {
              toast.success(tCommon("VisibilityUpdated"));
              return;
            }

            toast.error(tCommon("VisibilityUpdateFailed"));
          }}
        />
      )}
      <span className="font-semibold text-xs">
        {product.status === "published"
          ? tProducts("Labels.Active")
          : tProducts("Labels.Draft")}
      </span>
    </div>
  );
}
