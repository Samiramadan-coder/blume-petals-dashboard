"use client";

import {
  deleteCouponAction,
  updateCouponStatusAction,
} from "@/lib/promo-codes";
import { toast } from "sonner";
import { useState } from "react";
import { Switch } from "../ui/switch";
import CreateEdit from "./create-edit";
import { Spinner } from "../ui/spinner";
import { formatDate } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import EditBtn from "../reusable/edit-btn";
import { Pagination } from "@/types/shared";
import { useTranslations } from "next-intl";
import { Coupon } from "@/types/promo-codes";
import { Category } from "@/types/categories";
import DeleteBtn from "../reusable/delete-btn";
import FiltersControl from "./filters-control";
import LimitProgress from "../ui/limit-progress";
import { TableCell, TableRow } from "../ui/table";
import { columns } from "@/constants/promo-codes";
import { DataTable } from "../reusable/data-table";
import { usePermissions } from "@/providers/permission-providers";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export default function DataPreview({
  coupons,
  pagination,
  categories,
}: {
  coupons: Coupon[];
  pagination: Pagination;
  categories: Category[];
}) {
  const { can } = usePermissions();
  const t = useTranslations("PromoCodes");
  const tCommon = useTranslations("Common");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  return (
    <>
      <FiltersControl />

      {can("coupons.create") && (
        <div className="flex items-center justify-end gap-2">
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
          <CreateEdit categories={categories} />
        </div>
      )}

      <DataTable
        columns={columns(t)}
        rowsCount={coupons.length}
        countUnit={t("Title")}
        pagination={pagination}
        isCheckbox={checkedIds.length === coupons.length}
        onCheckboxChange={(checked) =>
          can("coupons.delete")
            ? setCheckedIds(checked ? coupons.map((c) => c.id) : [])
            : undefined
        }
      >
        {coupons.map((coupon, index) => (
          <TableRow key={index} className="border-primary/20">
            {can("contact.delete") && (
              <TableCell className="px-4 py-3">
                <Checkbox
                  checked={checkedIds.includes(coupon.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setCheckedIds([...checkedIds, coupon.id]);
                    } else {
                      setCheckedIds(
                        checkedIds.filter((id) => id !== coupon.id),
                      );
                    }
                  }}
                />
              </TableCell>
            )}

            <TableCell className="px-4 py-3">
              <div>
                <p className="font-bold">{coupon.code}</p>
                <p className="text-[10px] text-muted-foreground mt-1">
                  {coupon.scope === "all"
                    ? t("AllProducts")
                    : t("SpecificCategory")}
                </p>
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              <div>
                <p className="font-semibold">
                  ({coupon.value}{" "}
                  {coupon.type === "percentage" ? "%" : tCommon("AED")}){" "}
                  {t("Off")}
                </p>
                {coupon.min_order_total && (
                  <p className="text-[10px] mt-1 text-muted-foreground">
                    Min: {coupon.min_order_total} {tCommon("AED")}
                  </p>
                )}
                {coupon.per_customer_limit && (
                  <p className="text-[10px] mt-1 text-muted-foreground">
                    {coupon.per_customer_limit}x {t("PerCustomerLimit")}
                  </p>
                )}
              </div>
            </TableCell>

            <TableCell className="px-4 py-3">
              {coupon.usage_limit ? (
                <LimitProgress
                  value={coupon.used_count}
                  limit={coupon.usage_limit}
                />
              ) : (
                coupon.used_count
              )}
            </TableCell>

            <TableCell className="px-4 py-3">
              {coupon.starts_at && coupon.expires_at ? (
                <p className="text-muted-foreground text-xs">
                  {formatDate(coupon.starts_at)} -{" "}
                  {formatDate(coupon.expires_at)}
                </p>
              ) : coupon.starts_at ? (
                <p className="text-muted-foreground text-xs">
                  {t("From")}: {formatDate(coupon.starts_at)}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {t("UnlimitedDate")}
                </p>
              )}
            </TableCell>

            <TableCell className="px-4 py-3">
              <ActiveSwitch coupon={coupon} disabled={!can("coupons.edit")} />
            </TableCell>

            <TableCell className="px-4 py-3 space-x-4">
              {can("coupons.edit") && (
                <CreateEdit
                  coupon={coupon}
                  trigger={<EditBtn />}
                  categories={categories}
                />
              )}

              {can("coupons.delete") && (
                <DeleteBtn
                  onDelete={async () => {
                    setLoadingDelete(true);
                    const result = await deleteCouponAction(coupon);
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

/**
 * A switch component to toggle the visibility of a category.
 */
function ActiveSwitch({
  coupon,
  disabled,
}: {
  coupon: Coupon;
  disabled: boolean;
}) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={coupon.is_active}
          disabled={disabled}
          onClick={async () => {
            setLoading(true);
            const result = await updateCouponStatusAction(coupon);
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
