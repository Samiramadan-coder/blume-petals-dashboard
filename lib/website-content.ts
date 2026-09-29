import { HomePage } from "@/types/website-content";
import { http, ValidationError } from "./http";

// Create Notifications
type HomeResponse =
  | { success: true; message: string }
  | {
      success: false;
      errors?: Partial<Record<keyof HomePage, string>>;
    };

export async function postHomeAction(data: HomePage): Promise<HomeResponse> {
  try {
    const { data: responseData } = await http.put<{ message: string }>(
      "/api/v1/admin/pages/home",
      data,
    );
    return { success: true, message: responseData.message };
  } catch (error) {
    console.error("Error posting home action:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof HomePage, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}
