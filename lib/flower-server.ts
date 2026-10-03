"use server";

import { RestockFormValues } from "@/types/flower";
import { getErrorMessage, http, ValidationError } from "./http";
import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";

// Restock Flower Action
type RestockFlowerResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof RestockFormValues, string>>;
    };

export async function restockFlowerAction(
  formData: RestockFormValues,
  productId: number,
  variantId: number,
): Promise<RestockFlowerResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/products/${productId}/variants/${variantId}/stock`,
      formData,
    );
    updateTag("flowers");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Restock request failed", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof RestockFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }
}
