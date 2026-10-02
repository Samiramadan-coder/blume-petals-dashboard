"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http, ValidationError } from "@/lib/http";
import {
  DeliveryPickupLocation,
  DeliveryPickupLocationFormValues,
} from "@/types/delivery-pickup-locations";

// Post And Put Country Actions
type PostAndPutCountryResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof DeliveryPickupLocationFormValues, string>>;
    };

export async function postDeliveryPickupLocationAction(
  formData: DeliveryPickupLocationFormValues,
  locationId?: number,
): Promise<PostAndPutCountryResult> {
  const method = locationId ? "put" : "post";
  const url = locationId
    ? `/api/v1/admin/pickup-locations/${locationId}`
    : "/api/v1/admin/pickup-locations";

  try {
    const { data } = await http[method]<{ message: string }>(url, formData);
    updateTag("delivery-pickup-locations");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof DeliveryPickupLocationFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }
}

// Update Visibility Action
type UpdateLocationVisibilityResult =
  { success: true; message: string } | { success: false; message?: string };

export async function updateLocationVisibilityAction(
  location: DeliveryPickupLocation,
): Promise<UpdateLocationVisibilityResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/pickup-locations/${location.id}/visibility`,
      {
        is_active: !location.is_active,
      },
    );

    updateTag("delivery-pickup-locations");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error updating location visibility:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Country Action
type DeleteDeliveryPickupLocationResult =
  { success: true; message: string } | { success: false; message?: string };

export async function deleteDeliveryPickupLocationAction(
  location: DeliveryPickupLocation,
): Promise<DeleteDeliveryPickupLocationResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/pickup-locations/${location.id}`,
    );

    updateTag("delivery-pickup-locations");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting location:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Reorder Countries Action
type ReorderDeliveryPickupLocationsResult =
  { success: true; message: string } | { success: false; message?: string };

export async function reorderDeliveryPickupLocationsAction(
  ids: number[],
): Promise<ReorderDeliveryPickupLocationsResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      "/api/v1/admin/pickup-locations/reorder",
      {
        ids,
      },
    );
    updateTag("delivery-pickup-locations");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error reordering delivery pickup locations:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
