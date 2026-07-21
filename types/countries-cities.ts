import z from "zod";
import { LocaleObj, T } from "./shared";

/**
 * Country Schema for validation using zod
 */
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

/**
 * Country Form Values type for form submission
 */
export const citySchema = (t: T) =>
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
    country_id: z.number().min(1, t("Errors.Required")),
    delivery_fee: z.number().min(0, t("Errors.DeliveryFeeMinValue")),
    is_active: z.boolean(),
    sort_order: z.number(),
  });

export type CityFormValues = z.infer<ReturnType<typeof citySchema>>;

export type City = {
  id: number;
  country_id: number;
  name: LocaleObj;
  delivery_fee: string;
  sort_order: number;
  is_active: boolean;
  country: {
    id: number;
    name: LocaleObj;
  };
};
