"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Occasion, OccasionFormValues } from "@/types/occasions";

// Post And Put Category Actions
type PostAndPutOccasionsResult =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof OccasionFormValues, string>>;
    };

export async function postOccasionAction(
  formData: OccasionFormValues,
  occasionId?: number,
): Promise<PostAndPutOccasionsResult> {
  const method = occasionId ? "put" : "post";
  const url = occasionId
    ? `/api/v1/admin/occasions/${occasionId}`
    : "/api/v1/admin/occasions";

  const dataWithoutFiles: Partial<OccasionFormValues> = { ...formData };
  delete dataWithoutFiles.banner;

  try {
    const { data } = await http[method]<{ data: { occasion: Occasion } }>(
      url,
      dataWithoutFiles,
    );

    // Post Or Update Icon
    if (formData.banner instanceof Blob) {
      const bannerFormData = new FormData();
      bannerFormData.append("kind", "banner");
      bannerFormData.append(
        "image",
        formData.banner,
        formData.banner instanceof File ? formData.banner.name : "Banner",
      );
      await http.post(
        `/api/v1/admin/occasions/${data.data.occasion.id}/image`,
        bannerFormData,
      );
    }

    updateTag("occasions");
    return { success: true };
  } catch (err) {
    console.error("Error posting occasion:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof OccasionFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateOccasionVisibilityResult = { success: boolean };

export async function updateOccasionVisibilityAction(
  occasion: Occasion,
): Promise<UpdateOccasionVisibilityResult> {
  try {
    await http.patch(`/api/v1/admin/occasions/${occasion.id}/visibility`, {
      is_visible: !occasion.is_visible,
    });

    updateTag("occasions");
    return { success: true };
  } catch (err) {
    console.error("Error updating occasion visibility:", err);
    return { success: false };
  }
}

// Delete Occasion Action
type DeleteOccasionResult = { success: boolean };

export async function deleteOccasionAction(
  occasion: Occasion,
): Promise<DeleteOccasionResult> {
  try {
    await http.delete(`/api/v1/admin/occasions/${occasion.id}`);
    updateTag("occasions");
    return { success: true };
  } catch (err) {
    console.error("Error deleting occasion:", err);
    return { success: false };
  }
}

// Reorder Occasions Action
type ReorderOccasionsResult = { success: boolean };

export async function reorderOccasionsAction(
  ids: number[],
): Promise<ReorderOccasionsResult> {
  try {
    await http.patch("/api/v1/admin/occasions/reorder", {
      ids,
    });
    updateTag("occasions");
    return { success: true };
  } catch (err) {
    console.error("Error reordering occasions:", err);
    return { success: false };
  }
}
