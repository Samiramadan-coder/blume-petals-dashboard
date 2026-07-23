"use server";

import { updateTag } from "next/cache";
import { http } from "./http";

// Change Order Status
type ChangeOrderStatusResponse = { success: boolean };

export async function changeOrderStatus(
  orderId: number,
  status: string,
  note: string,
): Promise<ChangeOrderStatusResponse> {
  try {
    await http.patch(`/api/v1/admin/orders/${orderId}/status`, {
      status,
      note,
    });

    updateTag("orders");
    return { success: true };
  } catch (error) {
    console.error("Error changing order status:", error);
    return { success: false };
  }
}

// Update Admin Note
type UpdateAdminNoteResponse = { success: boolean };

export async function updateAdminNote(
  orderId: number,
  adminNote: string,
): Promise<UpdateAdminNoteResponse> {
  try {
    await http.patch(`/api/v1/admin/orders/${orderId}/notes`, {
      admin_notes: adminNote,
    });
    updateTag("orders");
    return { success: true };
  } catch (error) {
    console.error("Error updating admin note:", error);
    return { success: false };
  }
}
