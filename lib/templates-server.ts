"use server";

import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http, ValidationError } from "./http";
import { Card, Ribbon, RibbonFormValues } from "@/types/custom-builder";

// Edit Create Ribbon
type PostAndPutRibbonResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof RibbonFormValues, string>>;
    };

export async function postRibbonAction(
  formData: RibbonFormValues,
  ribbonId?: number,
): Promise<PostAndPutRibbonResult> {
  const method = ribbonId ? "put" : "post";
  const url = ribbonId
    ? `/api/v1/admin/gift-options/${ribbonId}`
    : "/api/v1/admin/gift-options";

  try {
    const { data } = await http[method]<{ message: string }>(url, formData);

    updateTag("ribbons");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Post Ribbon Action Error:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof RibbonFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Ribbon Action
type DeleteRibbonResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteRibbonAction(
  ribbon: Ribbon,
): Promise<DeleteRibbonResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/gift-options/${ribbon.id}`,
    );
    updateTag("ribbons");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting ribbon:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Card Action
type DeleteCardResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteCardAction(card: Card): Promise<DeleteCardResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/gift-options/${card.id}`,
    );
    updateTag("cards");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting card:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
