"use server";

import { Product } from "@/types/products";
import { http, ValidationError } from "./http";
import { updateTag } from "next/cache";
import {
  Ribbon,
  RibbonFormValues,
  TemplateFormValues,
} from "@/types/custom-builder";

// Post And Put Category Actions
type PostAndPutProductResult =
  | { success: true }
  | {
      success: false;
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

  try {
    const { data } = await http[method]<{
      data: {
        product: Product;
      };
    }>(url, dataWithoutFiles);

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

    // because the product is created first, we need to update the variant ids if they exist
    const preparedVariants = formData.variants.map((variant) => {
      const existingVariant = data.data.product.variants.find(
        (v) => v.sku === variant.sku,
      );
      return {
        ...variant,
        id: existingVariant?.id,
      };
    });

    // Post Or Update Variants
    preparedVariants.forEach(async (variant) => {
      if (variant.id) {
        await addVariantAction(data.data.product.id, variant, variant.id);
      } else {
        await addVariantAction(data.data.product.id, variant);
      }
    });

    updateTag("templates");
    return { success: true };
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
    return { success: false };
  }
}

// Add Variant Action
type AddVariantResult = {
  success: boolean;
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

    updateTag("templates");
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
    return { success: false };
  }
}

// Edit Create Ribbon
type PostAndPutRibbonResult =
  | { success: true }
  | {
      success: false;
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
    await http[method](url, formData);

    updateTag("ribbons");
    return { success: true };
  } catch (err) {
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
    return { success: false };
  }
}

// Delete Category Action
type DeleteRibbonResult = { success: boolean };

export async function deleteRibbonAction(
  ribbon: Ribbon,
): Promise<DeleteRibbonResult> {
  try {
    await http.delete(`/api/v1/admin/gift-options/${ribbon.id}`);
    updateTag("ribbons");
    return { success: true };
  } catch (err) {
    console.error("Error deleting ribbon:", err);
    return { success: false };
  }
}
