"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import {
  City,
  CityFormValues,
  Country,
  CountryFormValues,
} from "@/types/countries-cities";

// Post And Put Country Actions
type PostAndPutCountryResult =
  | { success: true; message: string }
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
    const { data } = await http[method]<{ message: string }>(url, formData);
    updateTag("countries");
    return { success: true, message: data.message };
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
type UpdateCountryVisibilityResult =
  | { success: true; message: string }
  | { success: false };

export async function updateCountryVisibilityAction(
  country: Country,
): Promise<UpdateCountryVisibilityResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/countries/${country.id}/visibility`,
      {
        is_active: !country.is_active,
      },
    );

    updateTag("countries");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error updating country visibility:", err);
    return { success: false };
  }
}

// Delete Country Action
type DeleteCountryResult =
  | { success: true; message: string }
  | { success: false };

export async function deleteCountryAction(
  country: Country,
): Promise<DeleteCountryResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/countries/${country.id}`,
    );
    updateTag("countries");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error deleting country:", err);
    return { success: false };
  }
}

// Reorder Countries Action
type ReorderCountriesResult =
  | { success: true; message: string }
  | { success: false };

export async function reorderCountriesAction(
  ids: number[],
): Promise<ReorderCountriesResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      "/api/v1/admin/countries/reorder",
      {
        ids,
      },
    );
    updateTag("countries");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error reordering countries:", err);
    return { success: false };
  }
}

// Post And Put Country Actions
type PostAndPutCityResult =
  | { success: true; message: string }
  | {
      success: false;
      errors?: Partial<Record<keyof CityFormValues, string>>;
    };

export async function postCityAction(
  formData: CityFormValues,
  cityId?: number,
): Promise<PostAndPutCityResult> {
  const method = cityId ? "put" : "post";
  const url = cityId
    ? `/api/v1/admin/cities/${cityId}`
    : "/api/v1/admin/cities";

  try {
    const { data } = await http[method]<{ message: string }>(url, formData);
    updateTag("cities");
    return { success: true, message: data.message };
  } catch (err) {
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof CityFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Reorder Countries Action
type ReorderCitiesResult =
  | { success: true; message: string }
  | { success: false };

export async function reorderCitiesAction(
  ids: number[],
): Promise<ReorderCitiesResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      "/api/v1/admin/cities/reorder",
      {
        ids,
      },
    );
    updateTag("cities");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error reordering cities:", err);
    return { success: false };
  }
}

// Delete Country Action
type DeleteCityResult = { success: true; message: string } | { success: false };

export async function deleteCityAction(city: City): Promise<DeleteCityResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/cities/${city.id}`,
    );
    updateTag("cities");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error deleting city:", err);
    return { success: false };
  }
}

// Update Visibility Action
type UpdateCityVisibilityResult =
  | { success: true; message: string }
  | { success: false };

export async function updateCityVisibilityAction(
  city: City,
): Promise<UpdateCityVisibilityResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/cities/${city.id}/visibility`,
      {
        is_active: !city.is_active,
      },
    );

    updateTag("cities");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error updating city visibility:", err);
    return { success: false };
  }
}
