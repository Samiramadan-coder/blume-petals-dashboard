"use server";

import { Product } from "@/types/products";
import { updateTag } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { getErrorMessage, http } from "@/lib/http";

// Update Visibility Action
type UpdateProductStatusResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function updateProductStatusAction(
  product: Product,
): Promise<UpdateProductStatusResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/products/${product.id}/status`,
      {
        status: product.status === "published" ? "draft" : "published",
      },
    );

    updateTag("products");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error updating product status:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Product Action
type DeleteProductResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteProductAction(
  product: Product,
): Promise<DeleteProductResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/products/${product.id}`,
    );
    updateTag("products");
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting product:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Add Image Action
type AddImageResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function addImageAction(
  productId: number,
  image: Blob,
): Promise<AddImageResult> {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("is_primary", "0");
    const { data } = await http.post<{ message: string }>(
      `/api/v1/admin/products/${productId}/images`,
      formData,
    );

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error adding image:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Set As Main Image Action
type SetAsMainImageResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function setAsMainImageAction(
  productId: number,
  imageId: number,
): Promise<SetAsMainImageResult> {
  try {
    const { data } = await http.patch<{ message: string }>(
      `/api/v1/admin/products/${productId}/images/${imageId}/primary`,
    );

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error setting image as main:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Image Action
type DeleteImageResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteImageAction(
  productId: number,
  imageId: number,
): Promise<DeleteImageResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/products/${productId}/images/${imageId}`,
    );
    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting image:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Delete Variant Action
type DeleteVariantResult =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteVariantAction(
  productId: number,
  variantId: number,
): Promise<DeleteVariantResult> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/products/${productId}/variants/${variantId}`,
    );
    return { success: true, message: data.message };
  } catch (err) {
    unstable_rethrow(err);
    console.error("Error deleting variant:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
