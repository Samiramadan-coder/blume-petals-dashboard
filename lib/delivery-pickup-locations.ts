"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import {
  DeliveryPickupLocation,
  DeliveryPickupLocationFormValues,
} from "@/types/delivery-pickup-locations";

// Post And Put Country Actions
type PostAndPutCountryResult =
  | { success: true }
  | {
      success: false;
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
    await http[method](url, formData);
    updateTag("delivery-pickup-locations");
    return { success: true };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof DeliveryPickupLocationFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateLocationVisibilityResult = { success: boolean };

export async function updateLocationVisibilityAction(
  location: DeliveryPickupLocation,
): Promise<UpdateLocationVisibilityResult> {
  try {
    await http.patch(
      `/api/v1/admin/pickup-locations/${location.id}/visibility`,
      {
        is_active: !location.is_active,
      },
    );

    updateTag("delivery-pickup-locations");
    return { success: true };
  } catch (err) {
    console.error("Error updating location visibility:", err);
    return { success: false };
  }
}

// Delete Country Action
type DeleteDeliveryPickupLocationResult = { success: boolean };

export async function deleteDeliveryPickupLocationAction(
  location: DeliveryPickupLocation,
): Promise<DeleteDeliveryPickupLocationResult> {
  try {
    await http.delete(`/api/v1/admin/pickup-locations/${location.id}`);

    updateTag("delivery-pickup-locations");
    return { success: true };
  } catch (err) {
    console.error("Error deleting location:", err);
    return { success: false };
  }
}

// Reorder Countries Action
type ReorderDeliveryPickupLocationsResult = { success: boolean };

export async function reorderDeliveryPickupLocationsAction(
  ids: number[],
): Promise<ReorderDeliveryPickupLocationsResult> {
  try {
    await http.patch("/api/v1/admin/pickup-locations/reorder", {
      ids,
    });
    updateTag("delivery-pickup-locations");
    return { success: true };
  } catch (err) {
    console.error("Error reordering delivery pickup locations:", err);
    return { success: false };
  }
}
