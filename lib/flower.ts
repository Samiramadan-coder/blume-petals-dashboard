"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Flower, FlowerFormValues } from "@/types/flower";

// Post And Put Flower Actions
type PostAndPutFlowerResult =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof FlowerFormValues, string>>;
    };

export async function postFlowerAction(
  formData: FlowerFormValues,
  flowerId?: number,
): Promise<PostAndPutFlowerResult> {
  const method = flowerId ? "put" : "post";
  const url = flowerId
    ? `/api/v1/admin/flowers/${flowerId}`
    : "/api/v1/admin/flowers";

  const dataWithoutFiles: Partial<FlowerFormValues> = { ...formData };
  delete dataWithoutFiles.photo;

  try {
    const { data } = await http[method]<{ data: { flower: Flower } }>(
      url,
      dataWithoutFiles,
    );

    // Post Or Update Photo
    if (formData.photo instanceof Blob) {
      const photoFormData = new FormData();
      photoFormData.append("kind", "photo");
      photoFormData.append(
        "image",
        formData.photo,
        formData.photo instanceof File ? formData.photo.name : "Photo",
      );
      await http.post(
        `/api/v1/admin/flowers/${data.data.flower.id}/image`,
        photoFormData,
      );
    }

    updateTag("flowers");
    return { success: true };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof FlowerFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Delete Flower Action
type DeleteFlowerResult = { success: boolean };

export async function deleteFlowerAction(
  flower: Flower,
): Promise<DeleteFlowerResult> {
  try {
    await http.delete(`/api/v1/admin/flowers/${flower.id}`);
    updateTag("flowers");
    return { success: true };
  } catch (err) {
    console.error("Error deleting flower:", err);
    return { success: false };
  }
}
