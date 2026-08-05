import { NotificationFormData } from "@/types/notifications";
import { http, ValidationError } from "./http";

// Create Notifications
type NotificationResponse =
  | { success: true }
  | {
      success: false;
      errors?: Partial<Record<keyof NotificationFormData, string>>;
    };

export async function postNotificationAction(
  data: NotificationFormData,
): Promise<NotificationResponse> {
  try {
    await http.post("/api/v1/admin/notifications/broadcast", data);
    return { success: true };
  } catch (error) {
    console.error("Error creating notification:", error);

    if (error instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(error.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof NotificationFormData, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}
