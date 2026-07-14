import z from "zod";
import { Pagination, T } from "./shared";

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
        sku: z.string().min(1, t("Errors.SKUIsRequired")),
        size: z.string().min(1, t("Errors.SizeIsRequired")),
        price: z.number().min(1, t("Errors.PriceIsRequired")),
        stock: z.number().min(1, t("Errors.StockQuantityIsRequired")),
        compare_at_price: z.number().nullable().optional(),
      }),
    ),

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
  sku: string;
  slug: string;
  category_id: number;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  components: {
    en: string;
    ar: string;
  };
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
  eta_text: {
    en: string;
    ar: string;
  };
  meta_title: {
    en: string;
    ar: string;
  };
  meta_description: {
    en: string;
    ar: string;
  };
  sort_order: number;
  variants: {
    id: number;
    sku: string;
    size: string;
    color_slug: string | null;
    color_hex: string | null;
    price: string;
    compare_at_price: string | null;
    is_on_sale: boolean;
    in_stock: boolean;
    available_stock: number;
  }[];
  images: string[];
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
