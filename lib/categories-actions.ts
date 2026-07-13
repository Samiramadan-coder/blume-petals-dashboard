"use server";

import { Category, CategoryFormValues } from "@/types/categories";
import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";

/**
 * Post And Put Category Actions
 */
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
