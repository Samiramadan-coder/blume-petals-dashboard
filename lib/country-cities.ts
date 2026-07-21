"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import { Country, CountryFormValues } from "@/types/countries-cities";

// Post And Put Country Actions
type PostAndPutCountryResult =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof CountryFormValues, string>>;
    };

export async function postCountryAction(
  formData: CountryFormValues,
  countryId?: number,
): Promise<PostAndPutCountryResult> {
  const method = countryId ? "put" : "post";
  const url = countryId
    ? `/api/v1/admin/countries/${countryId}`
    : "/api/v1/admin/countries";

  try {
    await http[method](url, formData);
    updateTag("countries");
    return { success: true };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof CountryFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateCountryVisibilityResult = { success: boolean };

export async function updateCountryVisibilityAction(
  country: Country,
): Promise<UpdateCountryVisibilityResult> {
  try {
    await http.patch(`/api/v1/admin/countries/${country.id}/visibility`, {
      is_active: !country.is_active,
    });

    updateTag("countries");
    return { success: true };
  } catch (err) {
    console.error("Error updating country visibility:", err);
    return { success: false };
  }
}

// Delete Country Action
type DeleteCountryResult = { success: boolean };

export async function deleteCountryAction(
  country: Country,
): Promise<DeleteCountryResult> {
  try {
    await http.delete(`/api/v1/admin/countries/${country.id}`);
    updateTag("countries");
    return { success: true };
  } catch (err) {
    console.error("Error deleting country:", err);
    return { success: false };
  }
}

// Reorder Countries Action
type ReorderCountriesResult = { success: boolean };

export async function reorderCountriesAction(
  ids: number[],
): Promise<ReorderCountriesResult> {
  try {
    await http.patch("/api/v1/admin/countries/reorder", {
      ids,
    });
    updateTag("countries");
    return { success: true };
  } catch (err) {
    console.error("Error reordering countries:", err);
    return { success: false };
  }
}
