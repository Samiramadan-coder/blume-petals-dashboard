import z from "zod";
import { T } from "./shared";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

export const productSchema = (t: T) =>
  z.object({
    name: z.object({
      en: z
        .string()
        .min(1, t("Errors.NameIsRequired"))
        .min(2, t("Errors.NameMinLength")),
      ar: z
        .string()
        .min(1, t("Errors.NameIsRequired"))
        .min(2, t("Errors.NameMinLength")),
    }),
    description: z.object({
      en: z
        .string()
        .min(1, t("Errors.DescriptionIsRequired"))
        .min(2, t("Errors.DescriptionMinLength")),
      ar: z
        .string()
        .min(1, t("Errors.DescriptionIsRequired"))
        .min(2, t("Errors.DescriptionMinLength")),
    }),
    category_id: z.string().min(1, t("Errors.CategoryIsRequired")),
    occasion_ids: z.array(z.number()).min(1, t("Errors.OccasionsIsRequired")),

    // price: z.number().min(1, "Price must be a positive number"),
    // salesPrice: z
    //   .number()
    //   .min(0, "Sales price must be a positive number")
    //   .optional(),
    // stockQuantity: z
    //   .number()
    //   .min(1, "Stock quantity must be a positive number"),
    // sku: z.string().optional(),
    // images: z.array(imageSchema).min(1, "Please upload at least one image"),
    // sizes: z.array(z.string()).min(1, "Please select at least one size"),
    // colors: z.array(z.string()).min(1, "Please select at least one color"),
    // occasions: z
    //   .array(z.string())
    //   .min(1, "Please select at least one occasion"),
    // showNewBadge: z.boolean(),
    // featuredOnHomepage: z.boolean(),
    // productStatus: z.string(),
  });

export type ProductFormValues = z.infer<ReturnType<typeof productSchema>>;

export type Product = ProductFormValues & {
  id: number;
  rating: number;
};
