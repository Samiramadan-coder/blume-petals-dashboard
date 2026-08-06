import { SettingsSchema } from "@/types/settings";
import { http } from "./http";

type SaveSettingsResponse = { success: boolean };

export async function saveSettings(
  settings: SettingsSchema,
): Promise<SaveSettingsResponse> {
  try {
    await http.put("/api/v1/admin/settings", settings);
    return { success: true };
  } catch (error) {
    console.error("Error saving settings:", error);
    return { success: false };
  }
}
