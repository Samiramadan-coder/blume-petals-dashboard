import { Product, ProductFormValues, Variant } from "@/types/products";
import { getErrorMessage, http, ValidationError } from "@/lib/http";

// Post And Put Category Actions
type PostAndPutProductResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof ProductFormValues, string>>;
    };

export async function postProductAction(
  formData: ProductFormValues,
  productId?: number,
): Promise<PostAndPutProductResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<ProductFormValues> = {
    ...formData,
  };

  delete dataWithoutFiles.images;

  let saved: { data: { product: Product }; message: string };

  try {
    const { data } = await http[method]<{
      data: { product: Product };
      message: string;
    }>(url, dataWithoutFiles);

    saved = data;
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
    return { success: false, message: getErrorMessage(err) };
  }

  // The product itself is saved at this point, so the list must refresh even
  // if an image or a size below fails.

  const product = saved.data.product;

  try {
    // Post Or Update Images
    for (const [index, image] of formData.images.entries()) {
      if (!(image instanceof Blob)) continue;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      imageFormData.append("is_primary", index === 0 ? "1" : "0");
      await http.post(
        `/api/v1/admin/products/${product.id}/images`,
        imageFormData,
      );
    }
  } catch (err) {
    console.error("Product image upload failed", err);
    return { success: false, message: getErrorMessage(err) };
  }

  // Post Or Update Variants, one at a time so a failure is reported.
  // The product is created first, so match existing variants by their sku.
  for (const variant of formData.variants) {
    const existingVariant = product.variants.find((v) => v.sku === variant.sku);

    const result = await addVariantAction(
      product.id,
      { ...variant, id: existingVariant?.id },
      existingVariant?.id,
    );

    if (!result.success) {
      return {
        success: false,
        message: Object.values(result.errors ?? {})[0] ?? result.message,
      };
    }
  }

  return { success: true, message: saved.message };
}

// // Add Variant Action
type AddVariantResult = {
  success: boolean;
  message?: string;
  errors?: Partial<Record<keyof ProductFormValues["variants"][number], string>>;
};

export async function addVariantAction(
  productId: number,
  variantData: ProductFormValues["variants"][number],
  variantId?: number,
): Promise<AddVariantResult> {
  const method = variantId ? "put" : "post";
  const url = variantId
    ? `/api/v1/admin/products/${productId}/variants/${variantId}`
    : `/api/v1/admin/products/${productId}/variants`;

  try {
    const { data } = await http[method]<{ data: { variant: Variant } }>(
      url,
      variantData,
    );

    const components = await updateComponentsAction(
      productId,
      data.data.variant.id!,
      variantData.recipe,
    );

    // updateTag("products");

    // The size is saved, but its flower recipe is not. Add-ons have no recipe,
    // so an empty one being rejected is not a failure.
    if (!components.success && variantData.recipe.length > 0) {
      return { success: false, message: components.message };
    }

    return { success: true };
  } catch (err) {
    // unstable_rethrow(err);
    console.error("Error adding variant:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof ProductFormValues["variants"][number], string>>;
      return { success: false, errors };
    }
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
    // unstable_rethrow(err);
    console.error("Error deleting variant:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}

// Update Components Action
type UpdateComponentsResult = { success: boolean; message?: string };

export async function updateComponentsAction(
  productId: number,
  variantId: number,
  components: ProductFormValues["variants"][number]["recipe"],
): Promise<UpdateComponentsResult> {
  try {
    await http.put(
      `/api/v1/admin/products/${productId}/variants/${variantId}/components`,
      { components },
    );

    return { success: true };
  } catch (err) {
    // unstable_rethrow(err);
    console.error("Error updating components:", err);
    return { success: false, message: getErrorMessage(err) };
  }
}
