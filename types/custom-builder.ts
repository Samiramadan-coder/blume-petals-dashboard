import z from "zod";
import { LocaleObj, T } from "./shared";

const imageSchema = (t: T) =>
  z.union([z.string(), z.instanceof(Blob)]).refine(
    (image) => {
      if (typeof image === "string") return true;
      return image.size <= 1024 * 1024;
    },
    { message: t("Fields.Photo.ImageMaxSize") },
  );

export const templateSchema = (t: T) =>
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
    category_id: z.number(),
    status: z.string(),
    is_purchasable: z.boolean(),
    show_in_builder: z.boolean(),
    tags: z.array(
      z
        .string()
        .min(1, t("Fields.Tags.Required"))
        .regex(/^template:[^\s:]+$/, t("Fields.Tags.Format")),
    ),
    sku: z
      .string()
      .min(1, t("Fields.SKU.Required"))
      .min(2, t("Fields.SKU.MinLength")),
    variants: z.array(
      z.object({
        id: z.number().optional(),
        sku: z.string(),
        price: z.number().min(1, t("Fields.ShapePrice.Required")),
        size: z.string().min(1, t("Fields.Size.Required")),
        min_stems: z.number().min(1, t("Fields.MinStems.Required")),
        max_stems: z.number().min(1, t("Fields.MaxStems.Required")),
      }),
    ),
    images: z
      .array(imageSchema(t))
      .min(1, t("Fields.Photo.AtLeastOneImageIsRequired")),
  });

export type TemplateFormValues = z.infer<ReturnType<typeof templateSchema>>;

// Ribbons Type
export const ribbonSchema = (t: T) =>
  z.object({
    color_hex: z.string().min(1, t("Ribbons.Fields.Color.Required")),
    kind: z.literal("ribbon"),
    name: z.object({
      en: z
        .string()
        .min(1, t("Ribbons.Fields.Name.Required"))
        .min(2, t("Ribbons.Fields.Name.MinLength")),
      ar: z
        .string()
        .min(1, t("Ribbons.Fields.Name.Required"))
        .min(2, t("Ribbons.Fields.Name.MinLength")),
    }),
    price: z.number().min(1, t("Ribbons.Fields.Price.Required")),
  });

export type RibbonFormValues = z.infer<ReturnType<typeof ribbonSchema>>;

export type Ribbon = {
  id: number;
  color_hex: string;
  kind: "ribbon";
  name: LocaleObj;
  price: string;
};

// Cards Type
export const cardSchema = (t: T) =>
  z.object({
    kind: z.literal("card_style"),
    name: z.object({
      en: z
        .string()
        .min(1, t("Cards.Fields.Name.Required"))
        .min(2, t("Cards.Fields.Name.MinLength")),
      ar: z
        .string()
        .min(1, t("Cards.Fields.Name.Required"))
        .min(2, t("Cards.Fields.Name.MinLength")),
    }),
    description: z.object({
      en: z
        .string()
        .min(1, t("Cards.Fields.Description.Required"))
        .min(2, t("Cards.Fields.Description.MinLength")),
      ar: z
        .string()
        .min(1, t("Cards.Fields.Description.Required"))
        .min(2, t("Cards.Fields.Description.MinLength")),
    }),
    price: z.number().min(1, t("Cards.Fields.Price.Required")),
    image: z.union([z.string().min(1), z.instanceof(Blob)]).refine(
      (image) => {
        if (typeof image === "string") return true;
        return image.size <= 1024 * 1024;
      },
      { message: t("Cards.Fields.Image.ImageMaxSize") },
    ),
  });

export type CardFormValues = z.infer<ReturnType<typeof cardSchema>>;

export type Card = {
  description: LocaleObj;
  id: number;
  image_path: string;
  image_url: string;
  kind: "card_style";
  name: LocaleObj;
  price: string;
};
