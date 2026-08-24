"use server";

import { FlowerFormValues } from "@/types/flower";
import { Product } from "@/types/products";
import { http, ValidationError } from "./http";
import { updateTag } from "next/cache";

// Post And Put Category Actions
type PostAndPutFlowerResult =
  | {
      success: true;
    }
  | {
      success: false;
      errors?: Partial<Record<keyof FlowerFormValues, string>>;
    };

export async function postFlowerAction(
  formData: FlowerFormValues,
  productId?: number,
): Promise<PostAndPutFlowerResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<FlowerFormValues> = {
    ...formData,
  };

  delete dataWithoutFiles.images;

  try {
    const { data } = await http[method]<{
      data: { product: Product };
    }>(url, dataWithoutFiles);

    // Post Or Update Images
    for (const [index, image] of formData.images.entries()) {
      if (!(image instanceof Blob)) continue;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      imageFormData.append("is_primary", index === 0 ? "1" : "0");
      await http.post(
        `/api/v1/admin/products/${data.data.product.id}/images`,
        imageFormData,
      );
    }

    updateTag("flowers");
    return { success: true };
  } catch (err) {
    console.error("Product create/update request failed", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof FlowerFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}
