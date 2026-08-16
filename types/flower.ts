import z from "zod";
import { T } from "./shared";

export const flowerSchema = (t: T) =>
  z.object({
    photo: z.union([
      z.string(),
      z
        .instanceof(Blob)
        .refine(
          (file) => file.size <= 1024 * 1024,
          t("Fields.Photo.FileLessThan1MB"),
        ),
    ]),
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
    initial_quantity: z.number().min(1, t("Fields.InitialQuantity.MinValue")),
    low_stock_threshold: z
      .number()
      .min(1, t("Fields.LowStockThreshold.MinValue")),
    unit_cost: z.number().min(1, t("Fields.UnitCost.MinValue")),
    note: z.object({
      en: z.string().optional(),
      ar: z.string().optional(),
    }),
  });

export type FlowerFormValues = z.infer<ReturnType<typeof flowerSchema>>;

export type Flower = FlowerFormValues & {
  id: number;
};
