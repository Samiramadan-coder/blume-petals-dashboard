import z from "zod";
import { Pagination, T } from "./shared";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);
const MAX_BANNER_SIZE = 1024 * 1024; // 1MB

export const occasionCollectionSchema = (t: T) =>
  z
    .object({
      name: z.object({
        en: z
          .string()
          .min(1, t("Errors.OccasionCollectionNameRequired"))
          .min(2, t("Errors.OccasionCollectionNameMinLength")),
        ar: z
          .string()
          .min(1, t("Errors.OccasionCollectionNameRequired"))
          .min(2, t("Errors.OccasionCollectionNameMinLength")),
      }),
      description: z.object({
        en: z.string().optional(),
        ar: z.string().optional(),
      }),
      slug: z
        .string()
        .min(1, t("Errors.OccasionCollectionSlugRequired"))
        .min(2, t("Errors.OccasionCollectionSlugMinLength")),
      type: z.string().min(1, t("Errors.OccasionCollectionTypeRequired")),
      color: z.string().min(1, t("Errors.OccasionCollectionColorRequired")),
      is_visible: z.boolean(),
      sort_order: z.number(),
      banner: imageSchema,
      starts_at: z.string(),
      ends_at: z.string(),
    })
    .superRefine((data, ctx) => {
      if (!data.banner) {
        ctx.addIssue({
          code: "custom",
          path: ["banner"],
          message: t("Errors.BannerIsRequired"),
        });
      }

      if (data.banner instanceof Blob && data.banner.size > MAX_BANNER_SIZE) {
        ctx.addIssue({
          code: "custom",
          path: ["banner"],
          message: t("Errors.BannerSizeExceeded"),
        });
      }

      if (data.starts_at && !data.ends_at) {
        ctx.addIssue({
          code: "custom",
          path: ["ends_at"],
          message: t("Errors.EndDateIsRequired"),
        });
      }

      if (!data.starts_at && data.ends_at) {
        ctx.addIssue({
          code: "custom",
          path: ["starts_at"],
          message: t("Errors.StartDateIsRequired"),
        });
      }

      if (data.starts_at > data.ends_at) {
        ctx.addIssue({
          code: "custom",
          path: ["ends_at"],
          message: t("Errors.EndDateMustBeAfterStartDate"),
        });
      }
    });

export type OccasionFormValues = z.infer<
  ReturnType<typeof occasionCollectionSchema>
>;

export type Occasion = {
  id: number;
  name: string;
  name_translations: { ar: string; en: string };
  description: string;
  description_translations: { ar: string; en: string };
  slug: string;
  type: string;
  sort_order: number;
  color: string;
  banner_path: string;
  banner_url: string;
  is_visible: boolean;
  starts_at: string;
  ends_at: string;
  created_at: string;
  updated_at: string;
  products_count: number;
};

export type OccasionResponse = {
  data: {
    items: Occasion[];
    pagination: Pagination;
  };
};
