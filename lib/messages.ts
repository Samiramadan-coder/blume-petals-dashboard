"use server";

import { updateTag } from "next/cache";
import { http } from "./http";

// Delete Message
type DeleteMessageResponse = { success: boolean };

export async function deleteMessage(
  messageId: number,
): Promise<DeleteMessageResponse> {
  try {
    await http.delete(`/api/v1/admin/contact-messages/${messageId}`);
    updateTag("messages");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false };
  }
}

// Mark Message as Read
type MarkMessageAsReadResponse = { success: boolean };

export async function markMessageAsRead(
  messageId: number,
): Promise<MarkMessageAsReadResponse> {
  try {
    await http.get(`/api/v1/admin/contact-messages/${messageId}`);
    updateTag("messages");
    return { success: true };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { success: false };
  }
}
