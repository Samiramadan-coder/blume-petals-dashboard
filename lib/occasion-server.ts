"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http } from "@/lib/http";
import { Occasion } from "@/types/occasions";

// Update Visibility Action
type UpdateOccasionVisibilityResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function updateOccasionVisibilityAction(
  occasion: Occasion,
): Promise<UpdateOccasionVisibilityResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/occasions/${occasion.id}/visibility`,
      {
        is_visible: !occasion.is_visible,
      },
    );

    updateTag("occasions");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error updating occasion visibility:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Occasion Action
type DeleteOccasionResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteOccasionAction(
  occasion: Occasion,
): Promise<DeleteOccasionResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/occasions/${occasion.id}`,
    );
    updateTag("occasions");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting occasion:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Reorder Occasions Action
type ReorderOccasionsResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function reorderOccasionsAction(
  ids: number[],
): Promise<ReorderOccasionsResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      "/api/v1/admin/occasions/reorder",
      {
        ids,
      },
    );
    updateTag("occasions");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error reordering occasions:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
