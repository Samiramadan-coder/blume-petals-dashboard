import z from "zod";
import { T } from "./shared";

const imageSchema = (t: T) =>
  z.union([z.string(), z.instanceof(Blob)]).refine(
    (image) => {
      if (typeof image === "string") return true;
      return image.size <= 1024 * 1024;
    },
    {
      message: t("Fields.Photo.FileLessThan1MB"),
    },
  );

export const flowerSchema = (t: T) =>
  z.object({
    name: z.object({
      en: z
        .string()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.MinLength")),
      ar: z
        .string()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.MinLength")),
    }),
    description: z.object({
      en: z.string(),
      ar: z.string(),
    }),
    category_id: z.number(),
    show_in_builder: z.boolean(),
    status: z.string(),
    sku: z
      .string()
      .min(1, t("Fields.FlowerSku.Required"))
      .min(2, t("Fields.FlowerSku.MinLength")),
    variants: z.array(
      z.object({
        id: z.number().optional(),
        price: z.number().min(1, t("Fields.UnitCost.MinValue")),
        stock: z.number().min(1, t("Fields.InitialQuantity.MinValue")),
        sku: z
          .string()
          .min(1, t("Fields.VariantSku.Required"))
          .min(2, t("Fields.VariantSku.MinLength")),
      }),
    ),
    images: z
      .array(imageSchema(t))
      .min(1, t("Fields.Photo.AtLeastOneImageIsRequired")),
  });

export type FlowerFormValues = z.infer<ReturnType<typeof flowerSchema>>;
