"use server";

import {
  Card,
  CardFormValues,
  TemplateFormValues,
} from "@/types/custom-builder";
import { Product } from "@/types/products";
import { getErrorMessage, http, ValidationError } from "./http";

// Post And Put Category Actions
type PostAndPutProductResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof TemplateFormValues, string>>;
    };

export async function postTemplateAction(
  formData: TemplateFormValues,
  productId?: number,
): Promise<PostAndPutProductResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<TemplateFormValues> = {
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
      ) as Partial<Record<keyof TemplateFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }

  // The template itself is saved at this point, so the list must refresh even
  // if an image or a shape below fails.
  // updateTag("templates");

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
    console.error("Template image upload failed", err);
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

// Add Variant Action
type AddVariantResult = {
  success: boolean;
  message?: string;
  errors?: Partial<
    Record<keyof TemplateFormValues["variants"][number], string>
  >;
};

export async function addVariantAction(
  productId: number,
  variantData: TemplateFormValues["variants"][number],
  variantId?: number,
): Promise<AddVariantResult> {
  const method = variantId ? "put" : "post";
  const url = variantId
    ? `/api/v1/admin/products/${productId}/variants/${variantId}`
    : `/api/v1/admin/products/${productId}/variants`;

  try {
    await http[method](url, variantData);

    return { success: true };
  } catch (err) {
    console.error("Error adding variant:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<
        Record<keyof TemplateFormValues["variants"][number], string>
      >;
      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }
}

// Edit Create Ribbon
type PostAndPutCardResult =
  | { success: true; message: string }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof CardFormValues, string>>;
    };

export async function postCardAction(
  formData: CardFormValues,
  cardId?: number,
): Promise<PostAndPutCardResult> {
  const method = cardId ? "put" : "post";
  const url = cardId
    ? `/api/v1/admin/gift-options/${cardId}`
    : "/api/v1/admin/gift-options";

  // The image goes through its own upload request below, never in this JSON body
  const dataWithoutFiles: Partial<CardFormValues> = {
    ...formData,
  };

  delete dataWithoutFiles.image;

  let saved: { data: { gift_option: Card }; message: string };

  try {
    const { data } = await http[method]<{
      data: { gift_option: Card };
      message: string;
    }>(url, dataWithoutFiles);

    saved = data;
  } catch (err) {
    console.error("Post Card Action Error:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof CardFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }

  // The card itself is saved at this point, so the list must refresh even if
  // the image upload below fails.

  // Post Or Update Banner
  if (formData.image instanceof Blob) {
    const imageFormData = new FormData();
    imageFormData.append("kind", "image");
    imageFormData.append(
      "image",
      formData.image,
      formData.image instanceof File ? formData.image.name : "Image",
    );

    try {
      await http.post(
        `/api/v1/admin/gift-options/${saved.data.gift_option.id}/image`,
        imageFormData,
      );
    } catch (err) {
      console.error("Card image upload failed", err);
      return { success: false, message: getErrorMessage(err) };
    }
  }

  return { success: true, message: saved.message };
}
