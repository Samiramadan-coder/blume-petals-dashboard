import z from "zod";
import { Pagination, T } from "./shared";
import { typesEnum } from "@/constants/shared";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

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
      slug: z
        .string()
        .min(1, t("Errors.OccasionCollectionSlugRequired"))
        .min(2, t("Errors.OccasionCollectionSlugMinLength")),
      type: z.enum(typesEnum, t("Errors.OccasionCollectionTypeRequired")),
      color: z.string().min(1, t("Errors.OccasionCollectionColorRequired")),
      banner: imageSchema,
      is_visible: z.boolean(),
      // startDate: z.string().min(1, "Please select a start date"),
      // endDate: z.string().min(1, "Please select an end date"),
    })
    .superRefine((data, ctx) => {
      if (!data.banner) {
        ctx.addIssue({
          code: "custom",
          path: ["banner"],
          message: t("Errors.BannerIsRequired"),
        });
      }
      // if (!data.startDate || !data.endDate) return;
      // if (data.startDate > data.endDate) {
      //   ctx.addIssue({
      //     code: "custom",
      //     path: ["endDate"],
      //     message: "End date must be after start date",
      //   });
      // }
    });

export type OccasionCollectionFormValues = z.infer<
  ReturnType<typeof occasionCollectionSchema>
>;

export type OccasionCollectionType = OccasionCollectionFormValues["type"];

export type OccasionCollection = {
  id: number;
  name: { ar: string; en: string };
  slug: string;
  type: OccasionCollectionType;
  color: string;
  banner_path: string;
  banner_url: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type OccasionCollectionResponse = {
  data: {
    items: OccasionCollection[];
    pagination: Pagination;
  };
};
