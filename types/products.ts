import z from "zod";
import { LocaleObj, Pagination, T } from "./shared";

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

    category_id: z.number().min(1, t("Errors.CategoryIsRequired")),

    occasion_ids: z.array(z.number()).min(1, t("Errors.OccasionsIsRequired")),

    status: z.string().min(1, t("Errors.StatusIsRequired")),

    sku: z
      .string()
      .min(1, t("Errors.SKUIsRequired"))
      .min(2, t("Errors.SKUMinLength")),

    variants: z.array(
      z.object({
        id: z.number().optional(),
        sku: z.string().min(1, t("Errors.SKUIsRequired")),
        size: z.string().min(1, t("Errors.SizeIsRequired")),
        price: z.number().min(1, t("Errors.PriceIsRequired")),
        stock: z.number().min(1, t("Errors.StockQuantityIsRequired")),
        compare_at_price: z.number().nullable().optional(),
        color_hex: z.string().nullable().optional(),
        is_on_sale: z.boolean().optional(),
        in_stock: z.boolean().optional(),
      }),
    ),

    images: z.array(imageSchema).min(1, "Please upload at least one image"),

    is_new: z.boolean(),

    show_in_builder: z.boolean(),
  });

export type ProductFormValues = z.infer<ReturnType<typeof productSchema>>;

export type Product = {
  id: number;
  sku: string;
  slug: string;
  category_id: number;
  name: LocaleObj;
  description: LocaleObj;
  components: LocaleObj;
  dimensions: string;
  tags: string[];
  price_from: string;
  status: string;
  published_at: string;
  is_purchasable: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_new: boolean;
  show_in_builder: boolean;
  builder_sort: number;
  rating_avg: string;
  rating_count: number;
  sold_count: number;
  eta_text: LocaleObj;
  meta_title: LocaleObj;
  meta_description: LocaleObj;
  sort_order: number;
  variants: {
    id: number;
    sku: string;
    size: string;
    color_slug: string | null;
    color_hex: string | null;
    price: number;
    compare_at_price: number | null;
    is_on_sale: boolean;
    in_stock: boolean;
    stock: number;
  }[];
  images: {
    id: number;
    is_primary: boolean;
    product_variant_id: number | null;
    sort_order: number;
    url: string;
  }[];
  occasion_ids: number[];
  created_at: string;
  updated_at: string;
};

export type ProductResponse = {
  data: {
    items: Product[];
    pagination: Pagination;
  };
};
