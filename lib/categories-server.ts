"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http } from "@/lib/http";
import { Category } from "@/types/categories";

// Update Visibility Action
type UpdateCategoryVisibilityResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function updateCategoryVisibilityAction(
  category: Category,
): Promise<UpdateCategoryVisibilityResult> {
  "use server";

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
  "use server";

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
  "use server";

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
