"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Product, ProductFormValues } from "@/types/products";

// Post And Put Category Actions
type ProductActionErrors = Record<string, string>;

type PostAndPutCategoryResult =
  | { success: true }
  | {
      success: false;
      errors?: ProductActionErrors;
    };

export async function postProductAction(
  formData: ProductFormValues,
  productId?: number,
): Promise<PostAndPutCategoryResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<ProductFormValues> = { ...formData };
  delete dataWithoutFiles.images;

  try {
    const { data } = await http[method]<{ data: { product: Product } }>(
      url,
      dataWithoutFiles,
    );

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

    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Product create/update request failed", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ProductFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateProductStatusResult = { success: boolean };

export async function updateProductStatusAction(
  product: Product,
): Promise<UpdateProductStatusResult> {
  try {
    await http.patch(`/api/v1/admin/products/${product.id}/status`, {
      status: product.status === "published" ? "draft" : "published",
    });

    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Error updating product status:", err);
    return { success: false };
  }
}

// Delete Category Action
type DeleteProductResult = { success: boolean };

export async function deleteProductAction(
  product: Product,
): Promise<DeleteProductResult> {
  try {
    await http.delete(`/api/v1/admin/products/${product.id}`);
    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Error deleting product:", err);
    return { success: false };
  }
}

// Reorder Categories Action
// type ReorderCategoriesResult = { success: boolean };

// export async function reorderCategoriesAction(
//   ids: number[],
// ): Promise<ReorderCategoriesResult> {
//   try {
//     await http.patch("/api/v1/admin/categories/reorder", {
//       ids,
//     });
//     updateTag("categories");
//     return { success: true };
//   } catch (err) {
//     console.error("Error reordering categories:", err);
//     return { success: false };
//   }
// }
