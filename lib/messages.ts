"use server";

import { updateTag } from "next/cache";
import { http } from "./http";

// Delete Message
type DeleteMessageResponse =
  | { success: true; message: string }
  | { success: false };

export async function deleteMessage(
  messageId: number,
): Promise<DeleteMessageResponse> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/contact-messages/${messageId}`,
    );
    updateTag("messages");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false };
  }
}

// Mark Message as Read
type MarkMessageAsReadResponse =
  | { success: true; message: string }
  | { success: false };

export async function markMessageAsRead(
  messageId: number,
): Promise<MarkMessageAsReadResponse> {
  try {
    const { data } = await http.get<{ message: string }>(
      `/api/v1/admin/contact-messages/${messageId}`,
    );
    updateTag("messages");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false };
  }
}
