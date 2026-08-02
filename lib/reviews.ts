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
