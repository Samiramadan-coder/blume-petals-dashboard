import z from "zod";
import { T } from "./shared";

export const deliveryPickupLocationSchema = (t: T) =>
  z.object({
    name: z.object({
      en: z
        .string()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.Min")),
      ar: z
        .string()
        .min(1, t("Fields.Name.Required"))
        .min(2, t("Fields.Name.Min")),
    }),
    address: z.object({
      en: z
        .string()
        .min(1, t("Fields.Address.Required"))
        .min(2, t("Fields.Address.Min")),
      ar: z
        .string()
        .min(1, t("Fields.Address.Required"))
        .min(2, t("Fields.Address.Min")),
    }),
    ready_in_text: z.object({
      en: z
        .string()
        .min(1, t("Fields.ReadyInText.Required"))
        .min(2, t("Fields.ReadyInText.Min")),
      ar: z
        .string()
        .min(1, t("Fields.ReadyInText.Required"))
        .min(2, t("Fields.ReadyInText.Min")),
    }),
    hours: z
      .string()
      .min(1, t("Fields.Hours.Required"))
      .min(2, t("Fields.Hours.Min")),
    city_id: z.number().min(1, t("Fields.City.Required")),
    latitude: z.number().min(1, t("Fields.Latitude.Required")),
    longitude: z.number().min(1, t("Fields.Longitude.Required")),
    is_active: z.boolean(),
  });

export type DeliveryPickupLocationFormValues = z.infer<
  ReturnType<typeof deliveryPickupLocationSchema>
>;
