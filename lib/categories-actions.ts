"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Category, CategoryFormValues } from "@/types/categories";

// Post And Put Category Actions
type PostAndPutCategoryResult =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof CategoryFormValues, string>>;
    };

export async function postCategoryAction(
  formData: CategoryFormValues,
): Promise<PostAndPutCategoryResult> {
  const dataWithoutFiles: Partial<CategoryFormValues> = { ...formData };
  delete dataWithoutFiles.icon;
  delete dataWithoutFiles.banner;

  try {
    const response = await http.post<{ data: Category }>(
      "/api/v1/admin/categories",
      dataWithoutFiles,
    );

    // Post Or Update Icon
    if (formData.icon instanceof Blob) {
      const iconFormData = new FormData();
      iconFormData.append(
        "icon",
        formData.icon,
        formData.icon instanceof File ? formData.icon.name : "Icon",
      );
      await http.post(
        `/api/v1/admin/categories/${response.data.data.id}/image`,
        iconFormData,
      );
    }

    // Post Or Update Icon
    if (formData.banner instanceof Blob) {
      const bannerFormData = new FormData();
      bannerFormData.append(
        "banner",
        formData.banner,
        formData.banner instanceof File ? formData.banner.name : "Banner",
      );
      await http.post(
        `/api/v1/admin/categories/${response.data.data.id}/image`,
        bannerFormData,
      );
    }

    updateTag("categories");
    return { success: true };
  } catch (err) {
    console.error("Error posting category:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof CategoryFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateCategoryVisibilityResult = { success: boolean };

export async function updateCategoryVisibilityAction(
  category: Category,
): Promise<UpdateCategoryVisibilityResult> {
  try {
    await http.patch(`/api/v1/admin/categories/${category.id}/visibility`, {
      is_visible: !category.is_visible,
    });

    updateTag("categories");
    return { success: true };
  } catch (err) {
    console.error("Error updating category visibility:", err);
    return { success: false };
  }
}

// Delete Category Action
type DeleteCategoryResult = { success: boolean };

export async function deleteCategoryAction(
  category: Category,
): Promise<DeleteCategoryResult> {
  try {
    await http.delete(`/api/v1/admin/categories/${category.id}`);
    updateTag("categories");
    return { success: true };
  } catch (err) {
    console.error("Error deleting category:", err);
    return { success: false };
  }
}
