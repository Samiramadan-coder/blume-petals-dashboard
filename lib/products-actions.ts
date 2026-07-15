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
      productId?: number;
    };

function mapValidationErrors(
  errors: Record<string, string[]>,
  prefix?: string,
): ProductActionErrors {
  const mapped: ProductActionErrors = {};

  for (const [rawField, messages] of Object.entries(errors)) {
    const normalizedField = rawField.replace(/\[(\d+)\]/g, ".$1");
    let field = normalizedField;
    if (prefix) {
      if (normalizedField === "image" || normalizedField === "images") {
        field = prefix;
      } else if (
        normalizedField !== prefix &&
        !normalizedField.startsWith(`${prefix}.`)
      ) {
        field = `${prefix}.${normalizedField}`;
      }
    }
    mapped[field] = messages[0] ?? "Invalid value";
  }

  return mapped;
}

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

    const actionErrors: ProductActionErrors = {};

    // Post Variants
    for (const [index, variant] of formData.variants.entries()) {
      const variantId = variant.id;
      const variantMethod = variantId ? "put" : "post";
      const variantUrl = variantId
        ? `/api/v1/admin/products/${data.data.product.id}/variants/${variantId}`
        : `/api/v1/admin/products/${data.data.product.id}/variants`;

      try {
        await http[variantMethod](variantUrl, {
          ...variant,
        });
      } catch (err) {
        if (err instanceof ValidationError) {
          Object.assign(
            actionErrors,
            mapValidationErrors(err.errors, `variants.${index}`),
          );
          continue;
        }

        throw err;
      }
    }

    // Post Or Update Images
    for (const [index, image] of formData.images.entries()) {
      if (!(image instanceof Blob)) continue;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      imageFormData.append("is_primary", index === 0 ? "1" : "0");

      try {
        await http.post(
          `/api/v1/admin/products/${data.data.product.id}/images`,
          imageFormData,
        );
      } catch (err) {
        if (err instanceof ValidationError) {
          Object.assign(
            actionErrors,
            mapValidationErrors(err.errors, "images"),
          );
          continue;
        }

        throw err;
      }
    }

    if (Object.keys(actionErrors).length > 0) {
      return {
        success: false,
        errors: actionErrors,
        productId: data.data.product.id,
      };
    }

    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Product create/update request failed", err);
    if (err instanceof ValidationError) {
      const errors = mapValidationErrors(err.errors);
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
// type UpdateCategoryVisibilityResult = { success: boolean };

// export async function updateCategoryVisibilityAction(
//   category: Category,
// ): Promise<UpdateCategoryVisibilityResult> {
//   try {
//     await http.patch(`/api/v1/admin/categories/${category.id}/visibility`, {
//       is_visible: !category.is_visible,
//     });

//     updateTag("categories");
//     return { success: true };
//   } catch (err) {
//     console.error("Error updating category visibility:", err);
//     return { success: false };
//   }
// }

// Delete Category Action
// type DeleteCategoryResult = { success: boolean };

// export async function deleteCategoryAction(
//   category: Category,
// ): Promise<DeleteCategoryResult> {
//   try {
//     await http.delete(`/api/v1/admin/categories/${category.id}`);
//     updateTag("categories");
//     return { success: true };
//   } catch (err) {
//     console.error("Error deleting category:", err);
//     return { success: false };
//   }
// }

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
