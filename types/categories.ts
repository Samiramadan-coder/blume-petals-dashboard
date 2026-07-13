import z from "zod";
import { Pagination, T } from "./shared";
import { typesEnum } from "@/constants/shared";

const imageSchema = z.union([z.string(), z.instanceof(Blob)]);

export const categorySchema = (t: T) =>
  z
    .object({
      name: z.object({
        en: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
        ar: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
      }),
      slug: z.string().min(1, t("SlugIsRequired")).min(3, t("SlugMinLength")),
      type: z.enum(typesEnum, t("SelectType")),
      color: z.string().min(1, t("SelectColor")),
      is_visible: z.boolean(),
      icon: imageSchema,
      banner: imageSchema,
    })
    .superRefine((data, ctx) => {
      if (!data.icon) {
        ctx.addIssue({
          code: "custom",
          path: ["icon"],
          message: t("IconIsRequired"),
        });
      }

      if (!data.banner) {
        ctx.addIssue({
          code: "custom",
          path: ["banner"],
          message: t("BannerIsRequired"),
        });
      }
    });

export type CategoryFormValues = z.infer<ReturnType<typeof categorySchema>>;

export type CategoryType = CategoryFormValues["type"];

export type Icon = {
  icon: React.ReactNode;
  id: number;
  label: string;
};

export type Category = CategoryFormValues & {
  id: number;
  icon_path: string;
  icon_url: string;
  banner_path: string;
  banner_url: string;
  created_at: string;
  updated_at: string;
};

export type CategoryResponse = {
  data: {
    items: Category[];
    pagination: Pagination;
  };
};
