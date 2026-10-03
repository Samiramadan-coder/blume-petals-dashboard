// "use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http, ValidationError } from "@/lib/http";
import { Category, CategoryFormValues } from "@/types/categories";

// Post And Put Category Actions
type PostAndPutCategoryResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof CategoryFormValues, string>>;
    };

export async function postCategoryAction(
  formData: CategoryFormValues,
  categoryId?: number,
): Promise<PostAndPutCategoryResult> {
  const method = categoryId ? "put" : "post";
  const url = categoryId
    ? `/api/v1/admin/categories/${categoryId}`
    : "/api/v1/admin/categories";

  const dataWithoutFiles: Partial<CategoryFormValues> = { ...formData };
  delete dataWithoutFiles.icon;
  delete dataWithoutFiles.banner;

  let saved: { data: { category: Category }; message: string };

  try {
    const { data } = await http[method]<{
      data: { category: Category };
      message: string;
    }>(url, dataWithoutFiles);

    saved = data;
  } catch (err) {
    // unstable_rethrow(err);
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
    return { success: false, message: getErrorMessage(err) };
  }

  // The category itself is saved at this point, so the list must refresh even
  // if an image upload below fails.
  // updateTag("categories");

  // Post Or Update Icon And Banner
  for (const kind of ["icon", "banner"] as const) {
    const file = formData[kind];
    if (!(file instanceof Blob)) continue;

    const imageFormData = new FormData();
    imageFormData.append("kind", kind);
    imageFormData.append(
      "image",
      file,
      file instanceof File ? file.name : kind === "icon" ? "Icon" : "Banner",
    );

    try {
      await http.post(
        `/api/v1/admin/categories/${saved.data.category.id}/image`,
        imageFormData,
      );
    } catch (err) {
      // unstable_rethrow(err);
      console.error(`Error uploading category ${kind}:`, err);
      return { success: false, message: getErrorMessage(err) };
    }
  }

  return { success: true, message: saved.message };
}

// Update Visibility Action
type UpdateCategoryVisibilityResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function updateCategoryVisibilityAction(
  category: Category,
): Promise<UpdateCategoryVisibilityResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/categories/${category.id}/visibility`,
      {
        is_visible: !category.is_visible,
      },
    );

    updateTag("categories");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error updating category visibility:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Category Action
type DeleteCategoryResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteCategoryAction(
  category: Category,
): Promise<DeleteCategoryResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/categories/${category.id}`,
    );
    updateTag("categories");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting category:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Reorder Categories Action
type ReorderCategoriesResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function reorderCategoriesAction(
  ids: number[],
): Promise<ReorderCategoriesResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      "/api/v1/admin/categories/reorder",
      ids,
    );

    updateTag("categories");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error reordering categories:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
