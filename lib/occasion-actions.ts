"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http, ValidationError } from "@/lib/http";
import { Occasion, OccasionFormValues } from "@/types/occasions";

// Post And Put Category Actions
type PostAndPutOccasionsResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
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

  let saved: { data: { occasion: Occasion }; message: string };

  try {
    const { data } = await http[method]<{
      data: { occasion: Occasion };
      message: string;
    }>(url, dataWithoutFiles);

    saved = data;
  } catch (err) {
    unstable_rethrow(err);
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
    return { success: false, message: getErrorMessage(err) };
  }

  // The occasion itself is saved at this point, so the list must refresh even
  // if the banner upload below fails.
  updateTag("occasions");

  // Post Or Update Icon
  if (formData.banner instanceof Blob) {
    const bannerFormData = new FormData();
    bannerFormData.append("kind", "banner");
    bannerFormData.append(
      "image",
      formData.banner,
      formData.banner instanceof File ? formData.banner.name : "Banner",
    );

    try {
      await http.post(
        `/api/v1/admin/occasions/${saved.data.occasion.id}/image`,
        bannerFormData,
      );
    } catch (err) {
      unstable_rethrow(err);
      console.error("Error uploading occasion banner:", err);
      return { success: false, message: getErrorMessage(err) };
    }
  }

  return { success: true, message: saved.message };
}

// Update Visibility Action
type UpdateOccasionVisibilityResult =
  { success: true; message: string } | { success: false; message?: string };

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
  { success: true; message: string } | { success: false; message?: string };

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
  { success: true; message: string } | { success: false; message?: string };

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
