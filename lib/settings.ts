import { SettingsSchema } from "@/types/settings";
import { http } from "./http";

type SaveSettingsResponse = { success: boolean };

export async function saveSettings(
  settings: SettingsSchema,
): Promise<SaveSettingsResponse> {
  try {
    const dataWithoutLogo: Partial<SettingsSchema> = { ...settings };
    delete dataWithoutLogo.logo_url;
    await http.put("/api/v1/admin/settings", dataWithoutLogo);

    if (settings.logo_url instanceof File) {
      const formData = new FormData();
      formData.append("logo", settings.logo_url, settings.logo_url.name);
      await http.post("/api/v1/admin/settings/logo", formData);
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false };
  }
}
