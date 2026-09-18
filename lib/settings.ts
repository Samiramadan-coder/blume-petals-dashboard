"use client";

import { SettingsSchema } from "@/types/settings";
import { http, ValidationError } from "./http";

type SaveSettingsResponse =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof SettingsSchema, string>>;
    };

export async function saveSettings(
  settings: SettingsSchema,
): Promise<SaveSettingsResponse> {
  try {
    const dataWithoutLogo: Partial<SettingsSchema> = { ...settings };
    delete dataWithoutLogo.logo_url;
    const { data } = await http.put<{ message: string }>(
      "/api/v1/admin/settings",
      dataWithoutLogo,
    );

    if (settings.logo_url instanceof File) {
      const formData = new FormData();
      formData.append("logo", settings.logo_url, settings.logo_url.name);
      await http.post("/api/v1/admin/settings/logo", formData);
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error saving settings:", error);
    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof SettingsSchema, string>>;

      return { success: false, errors, message: error.message };
    }
    return { success: false };
  }
}
