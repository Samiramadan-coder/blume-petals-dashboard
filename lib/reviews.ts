"use server";

import { http } from "./http";
import { updateTag } from "next/cache";
import { Review } from "@/types/reviews";

// Delete Review Action
type DeleteReviewResult = { success: boolean };

export async function deleteReviewAction(
  review: Review,
): Promise<DeleteReviewResult> {
  try {
    await http.delete(`/api/v1/admin/reviews/${review.id}`);
    updateTag("reviews");
    return { success: true };
  } catch (err) {
    console.error("Error deleting review:", err);
    return { success: false };
  }
}

// Flag Review Action
type FlagReviewResult = { success: true; message: string } | { success: false };

export async function flagReviewAction(
  reviewId: number,
): Promise<FlagReviewResult> {
  try {
    const { data } = await http.post<{ message: string }>(
      `/api/v1/admin/reviews/${reviewId}/flag`,
    );
    updateTag("reviews");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error flagging review:", err);
    return { success: false };
  }
}

// Flag Review Action
type DeleteFlagReviewResult =
  | { success: true; message: string }
  | { success: false };

export async function deleteFlagReviewAction(
  reviewId: number,
): Promise<DeleteFlagReviewResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/reviews/${reviewId}/flag`,
    );
    updateTag("reviews");
    return { success: true, message: data.message };
  } catch (err) {
    console.error("Error deleting flag from review:", err);
    return { success: false };
  }
}
