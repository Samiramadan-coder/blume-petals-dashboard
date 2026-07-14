"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Product, ProductFormValues } from "@/types/products";

// Post And Put Category Actions
type PostAndPutCategoryResult =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof ProductFormValues, string>>;
    };

export async function postProductAction(
  formData: ProductFormValues,
  productId?: number,
): Promise<PostAndPutCategoryResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  // const dataWithoutFiles: Partial<ProductFormValues> = { ...formData };
  // delete dataWithoutFiles.icon;
  // delete dataWithoutFiles.banner;

  try {
    const { data } = await http[method]<{ data: { product: Product } }>(
      url,
      formData,
    );

    // Post Variants
    await http.post(`/api/v1/admin/products/${data.data.product.id}/variants`, {
      variant: formData.variants[0],
    });

    // Post Or Update Icon
    // if (formData.banner instanceof Blob) {
    //   const bannerFormData = new FormData();
    //   bannerFormData.append("kind", "banner");
    //   bannerFormData.append(
    //     "image",
    //     formData.banner,
    //     formData.banner instanceof File ? formData.banner.name : "Banner",
    //   );
    //   await http.post(
    //     `/api/v1/admin/categories/${data.data.category.id}/image`,
    //     bannerFormData,
    //   );
    // }

    updateTag("products");
    return { success: true };
  } catch (err) {
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
