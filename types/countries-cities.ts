import z from "zod";
import { LocaleObj, T } from "./shared";

export const countrySchema = (t: T) =>
  z.object({
    name: z.object({
      en: z
        .string()
        .min(1, t("Errors.Required"))
        .min(2, t("Errors.NameMinLength")),
      ar: z
        .string()
        .min(1, t("Errors.Required"))
        .min(2, t("Errors.NameMinLength")),
    }),
    code: z
      .string()
      .min(1, t("Errors.Required"))
      .min(2, t("Errors.CodeMinLength")),
    is_active: z.boolean(),
    sort_order: z.number(),
  });

export type CountryFormValues = z.infer<ReturnType<typeof countrySchema>>;

export type Country = {
  id: number;
  name: LocaleObj;
  code: string;
  sort_order: number;
  is_active: boolean;
  cities_count: number;
};
