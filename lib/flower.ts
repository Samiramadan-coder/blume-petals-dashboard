import { FlowerFormValues } from "@/types/flower";
import { Product } from "@/types/products";
import { getErrorMessage, http, ValidationError } from "./http";

// Post And Put Category Actions
type PostAndPutFlowerResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof FlowerFormValues, string>>;
    };

export async function postFlowerAction(
  formData: FlowerFormValues,
  productId?: number,
): Promise<PostAndPutFlowerResult> {
  const method = productId ? "put" : "post";
  const url = productId
    ? `/api/v1/admin/products/${productId}`
    : "/api/v1/admin/products";

  const dataWithoutFiles: Partial<FlowerFormValues> = {
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
      ) as Partial<Record<keyof FlowerFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }

  // The flower itself is saved at this point, so the list must refresh even
  // if the photo upload below fails.

  try {
    for (const [index, image] of formData.images.entries()) {
      if (!(image instanceof Blob)) continue;
      const imageFormData = new FormData();
      imageFormData.append("image", image);
      imageFormData.append("is_primary", index === 0 ? "1" : "0");
      await http.post(
        `/api/v1/admin/products/${saved.data.product.id}/images`,
        imageFormData,
      );
    }
  } catch (err) {
    console.error("Flower photo upload failed", err);
    return { success: false, message: getErrorMessage(err) };
  }

  return { success: true, message: saved.message };
}
