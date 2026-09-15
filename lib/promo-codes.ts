"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Coupon, PromoCodeFormValues } from "@/types/promo-codes";

// Post And Put Category Actions
type PromoCodesActionErrors = Record<string, string>;

type PostAndPutPromoCodeResult =
  | { success: true; message: string }
  | {
      success: false;
      errors?: PromoCodesActionErrors;
    };

export async function postPromoCodeAction(
  formData: PromoCodeFormValues,
  couponId?: number,
): Promise<PostAndPutPromoCodeResult> {
  const method = couponId ? "put" : "post";
  const url = couponId
    ? `/api/v1/admin/coupons/${couponId}`
    : "/api/v1/admin/coupons";

  try {
    const { data } = await http[method]<{ message: string }>(url, formData);

    updateTag("promo-codes");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Promo code create/update request failed", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof PromoCodeFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateCouponStatusResult =
  | { success: true; message: string }
  | { success: false };

export async function updateCouponStatusAction(
  coupon: Coupon,
): Promise<UpdateCouponStatusResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/coupons/${coupon.id}/active`,
      {
        is_active: !coupon.is_active,
      },
    );

    updateTag("promo-codes");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error updating coupon status:", err);
    return { success: false };
  }
}

// Delete Coupon Action
type DeleteCouponResult =
  | { success: true; message: string }
  | { success: false };

export async function deleteCouponAction(
  coupon: Coupon,
): Promise<DeleteCouponResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/coupons/${coupon.id}`,
    );
    updateTag("promo-codes");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error deleting coupon:", err);
    return { success: false };
  }
}
