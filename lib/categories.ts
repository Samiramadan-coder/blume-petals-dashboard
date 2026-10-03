import { getErrorMessage, http, ValidationError } from "@/lib/http";
import { Category, CategoryFormValues } from "@/types/categories";

// Post And Put Category Actions
type PostAndPutCategoryResult =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
      errors?: Partial<Record<keyof CategoryFormValues, string>>;
    };

export async function postCategoryAction(
  formData: CategoryFormValues,
  categoryId?: number,
): Promise<PostAndPutCategoryResult> {
  const method = categoryId ? "put" : "post";
  const url = categoryId
    ? `/api/v1/admin/categories/${categoryId}`
    : "/api/v1/admin/categories";

  const dataWithoutFiles: Partial<CategoryFormValues> = { ...formData };
  delete dataWithoutFiles.icon;
  delete dataWithoutFiles.banner;

  let saved: { data: { category: Category }; message: string };

  try {
    const { data } = await http[method]<{
      data: { category: Category };
      message: string;
    }>(url, dataWithoutFiles);

    saved = data;
  } catch (err) {
    console.error("Error posting category:", err);
    if (err instanceof ValidationError) {
      const errors = Object.fromEntries(
        Object.entries(err.errors).map(([field, messages]) => [
          field,
          messages[0] ?? "Invalid value",
        ]),
      ) as Partial<Record<keyof CategoryFormValues, string>>;

      return { success: false, errors };
    }
    return { success: false, message: getErrorMessage(err) };
  }

  // The category itself is saved at this point, so the list must refresh even
  // if an image upload below fails.
  // updateTag("categories");

  // Post Or Update Icon And Banner
  for (const kind of ["icon", "banner"] as const) {
    const file = formData[kind];
    if (!(file instanceof Blob)) continue;

    const imageFormData = new FormData();
    imageFormData.append("kind", kind);
    imageFormData.append(
      "image",
      file,
      file instanceof File ? file.name : kind === "icon" ? "Icon" : "Banner",
    );

    try {
      await http.post(
        `/api/v1/admin/categories/${saved.data.category.id}/image`,
        imageFormData,
      );
    } catch (err) {
      console.error(`Error uploading category ${kind}:`, err);
      return { success: false, message: getErrorMessage(err) };
    }
  }

  return { success: true, message: saved.message };
}
