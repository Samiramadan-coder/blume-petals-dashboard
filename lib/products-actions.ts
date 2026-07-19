"use server";

import { updateTag } from "next/cache";
import { http, ValidationError } from "@/lib/http";
import {
  Product,
  ProductFormValues,
  VariantFormValues,
} from "@/types/products";

// Post And Put Category Actions
type ProductActionErrors = Record<string, string>;

type PostAndPutCategoryResult =
  | { success: true }
  | {
      success: false;
      errors?: ProductActionErrors;
    };

export async function postProductAction(
  formData: ProductFormValues,
  productId?: number,
): Promise<PostAndPutCategoryResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<ProductFormValues> = { ...formData };
  delete dataWithoutFiles.images;

  try {
    const { data } = await http[method]<{ data: { product: Product } }>(
      url,
      dataWithoutFiles,
    );

    // Post Or Update Images
    for (const [index, image] of formData.images.entries()) {
      if (!(image instanceof Blob)) continue;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      imageFormData.append("is_primary", index === 0 ? "1" : "0");

      await http.post(
        `/api/v1/admin/products/${data.data.product.id}/images`,
        imageFormData,
      );
    }

    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Product create/update request failed", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ProductFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false };
  }
}

// Update Visibility Action
type UpdateProductStatusResult = { success: boolean };

export async function updateProductStatusAction(
  product: Product,
): Promise<UpdateProductStatusResult> {
  try {
    await http.patch(`/api/v1/admin/products/${product.id}/status`, {
      status: product.status === "published" ? "draft" : "published",
    });

    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Error updating product status:", err);
    return { success: false };
  }
}

// Delete Product Action
type DeleteProductResult = { success: boolean };

export async function deleteProductAction(
  product: Product,
): Promise<DeleteProductResult> {
  try {
    await http.delete(`/api/v1/admin/products/${product.id}`);
    updateTag("products");
    return { success: true };
  } catch (err) {
    console.error("Error deleting product:", err);
    return { success: false };
  }
}

// Add Image Action
type AddImageResult = { success: boolean };

export async function addImageAction(
  productId: number,
  image: Blob,
): Promise<AddImageResult> {
  try {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("is_primary", "0");
    await http.post(`/api/v1/admin/products/${productId}/images`, formData);

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true };
  } catch (err) {
    console.error("Error adding image:", err);
    return { success: false };
  }
}

// Set As Main Image Action
type SetAsMainImageResult = { success: boolean };

export async function setAsMainImageAction(
  productId: number,
  imageId: number,
): Promise<SetAsMainImageResult> {
  try {
    await http.patch(
      `/api/v1/admin/products/${productId}/images/${imageId}/primary`,
    );

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true };
  } catch (err) {
    console.error("Error setting image as main:", err);
    return { success: false };
  }
}

// Delete Image Action
type DeleteImageResult = { success: boolean };

export async function deleteImageAction(
  productId: number,
  imageId: number,
): Promise<DeleteImageResult> {
  try {
    await http.delete(`/api/v1/admin/products/${productId}/images/${imageId}`);
    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true };
  } catch (err) {
    console.error("Error deleting image:", err);
    return { success: false };
  }
}

// Add Variant Action
type AddVariantResult = {
  success: boolean;
  errors?: Partial<Record<keyof VariantFormValues, string>>;
};

export async function addVariantAction(
  productId: number,
  variantData: VariantFormValues,
  variantId?: number,
): Promise<AddVariantResult> {
  const method = variantId ? "put" : "post";
  const url = variantId
    ? `/api/v1/admin/products/${productId}/variants/${variantId}`
    : `/api/v1/admin/products/${productId}/variants`;

  try {
    await http[method](url, variantData);

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true };
  } catch (err) {
    console.error("Error adding variant:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof VariantFormValues, string>>;
      return { success: false, errors };
    }
    return { success: false };
  }
}

// Delete Variant Action
type DeleteVariantResult = { success: boolean };

export async function deleteVariantAction(
  productId: number,
  variantId: number,
): Promise<DeleteVariantResult> {
  try {
    await http.delete(
      `/api/v1/admin/products/${productId}/variants/${variantId}`,
    );

    updateTag("products");
    updateTag(`product-${productId}`);
    return { success: true };
  } catch (err) {
    console.error("Error deleting variant:", err);
    return { success: false };
  }
}
