import z from "zod";
import { T } from "./shared";

const imageSchema = (t: T) =>
  z
    .union([
      z.string().min(1, t("Fields.Photo.AtLeastOneImageIsRequired")),
      z.instanceof(Blob, {
        message: t("Fields.Photo.AtLeastOneImageIsRequired"),
      }),
    ])
    .refine(
      (image) => {
        if (typeof image === "string") return true;
        return image.size <= 1024 * 1024;
      },
      {
        message: t("Fields.Photo.FileLessThan1MB"),
      },
    );

// The initial quantity is only asked for (and required) when creating a flower.
// On edit the field is hidden, so an out-of-stock flower must stay editable.
export const flowerSchema = (t: T, isEdit = false) =>
  z.object({
    name: z.object({
      en: z
        .string()
        .trim()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.MinLength")),
      ar: z
        .string()
        .trim()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.MinLength")),
    }),
    description: z.object({
      en: z.string(),
      ar: z.string(),
    }),
    category_id: z.number(),
    show_in_builder: z.boolean(),
    is_purchasable: z.boolean(),
    status: z.string(),
    sku: z
      .string()
      .trim()
      .min(1, t("Fields.FlowerSku.Required"))
      .min(2, t("Fields.FlowerSku.MinLength")),
    variants: z.array(
      z.object({
        id: z.number().optional(),
        price: z
          .number(t("Fields.UnitCost.MinValue"))
          .min(1, t("Fields.UnitCost.MinValue")),
        stock: z
          .number(t("Fields.InitialQuantity.MinValue"))
          .min(isEdit ? 0 : 1, t("Fields.InitialQuantity.MinValue")),
        sku: z.string(),
        cost_price: z.number().optional(),
      }),
    ),
    images: z
      .array(imageSchema(t))
      .min(1, t("Fields.Photo.AtLeastOneImageIsRequired")),
  });

export type FlowerFormValues = z.infer<ReturnType<typeof flowerSchema>>;

export const restockSchema = (t: T) =>
  z.object({
    mode: z.enum(["increment"]),
    value: z.number(t("Restock.Required")).min(1, t("Restock.Required")),
  });

export type RestockFormValues = z.infer<ReturnType<typeof restockSchema>>;

export type LogItem = {
  balance: number;
  by: string | null;
  change: number;
  date: string;
  id: number;
  label: string;
  note: string | null;
};
