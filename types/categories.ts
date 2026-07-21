import z from "zod";
import { Pagination, T } from "./shared";

export const categorySchema = (t: T) =>
  z
    .object({
      name: z.object({
        en: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
        ar: z.string().min(1, t("NameIsRequired")).min(3, t("NameMinLength")),
      }),
      slug: z.string().min(1, t("SlugIsRequired")).min(3, t("SlugMinLength")),
      type: z.enum(["default", "addon"], t("SelectType")),
      color: z.string().min(1, t("SelectColor")),
      is_visible: z.boolean(),
      sort_order: z.number(),
      icon: z.union([
        z.string(),
        z
          .instanceof(Blob)
          .refine((file) => file.size <= 1024 * 1024, t("FileLessThan1MB")),
      ]),
      banner: z.union([
        z.string(),
        z
          .instanceof(Blob)
          .refine((file) => file.size <= 1024 * 1024, t("FileLessThan1MB")),
      ]),
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

export type Category = {
  id: number;
  name: { ar: string; en: string };
  slug: string;
  type: CategoryType;
  color: string;
  is_visible: boolean;
  sort_order: number;
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
