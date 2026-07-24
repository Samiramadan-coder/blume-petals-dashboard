"use client";

import { Coupon } from "@/types/promo-codes";
import { Pagination } from "@/types/shared";
import { DataTable } from "../reusable/data-table";
import { columns } from "@/constants/promo-codes";
import { useTranslations } from "next-intl";
import { useQueryParam } from "@/hooks/use-search-params";
import { TableCell, TableRow } from "../ui/table";
import CreateEdit from "./create-edit";
import { Checkbox } from "../ui/checkbox";
import { Spinner } from "../ui/spinner";
import { Switch } from "../ui/switch";
import { toast } from "sonner";
import { useState } from "react";
import {
  deleteCouponAction,
  updateCouponStatusAction,
} from "@/lib/promo-codes";
import EditBtn from "../reusable/edit-btn";
import LimitProgress from "../ui/limit-progress";
import DeleteBtn from "../reusable/delete-btn";
import { Category } from "@/types/categories";

export default function DataPreview({
  coupons,
  pagination,
  categories,
}: {
  coupons: Coupon[];
  pagination: Pagination;
  categories: Category[];
}) {
  const t = useTranslations("PromoCodes");
  const tCommon = useTranslations("Common");
  const { setQueryParam } = useQueryParam();
  const [loadingDelete, setLoadingDelete] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <CreateEdit categories={categories} />
      </div>

      <DataTable
        columns={columns(t)}
        rowsCount={coupons.length}
        countUnit={t("Title")}
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
        onCheckboxChange={(checked) => console.log(checked)}
        onPageChange={(page) => setQueryParam("page", page.toString())}
      >
        {coupons.map((coupon, index) => (
          <TableRow key={index}>
            <TableCell className="px-4 py-3">
              <Checkbox />
            </TableCell>

            <TableCell className="px-4 py-3">
              <p>{coupon.code}</p>
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
                  {new Date(coupon.starts_at).toLocaleDateString()} -{" "}
                  {new Date(coupon.expires_at).toLocaleDateString()}
                </p>
              ) : coupon.starts_at ? (
                <p className="text-muted-foreground text-xs">
                  {t("From")}: {new Date(coupon.starts_at).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {t("UnlimitedDate")}
                </p>
              )}
            </TableCell>

            <TableCell className="px-4 py-3">
              <ActiveSwitch coupon={coupon} />
            </TableCell>

            <TableCell className="px-4 py-3">
              <CreateEdit
                coupon={coupon}
                trigger={<EditBtn />}
                categories={categories}
              />

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
function ActiveSwitch({ coupon }: { coupon: Coupon }) {
  const tCommon = useTranslations("Common");
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <Spinner className="text-primary" />
      ) : (
        <Switch
          checked={coupon.is_active}
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
