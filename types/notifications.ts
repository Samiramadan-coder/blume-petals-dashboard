import z from "zod";
import { T } from "./shared";

export const notificationSchema = (t: T) =>
  z.object({
    title: z.object({
      en: z
        .string()
        .min(1, t("Fields.Title.Required"))
        .min(2, t("Fields.Title.Min")),
      ar: z
        .string()
        .min(1, t("Fields.Title.Required"))
        .min(2, t("Fields.Title.Min")),
    }),

    body: z.object({
      en: z
        .string()
        .min(1, t("Fields.Body.Required"))
        .min(2, t("Fields.Body.Min")),
      ar: z
        .string()
        .min(1, t("Fields.Body.Required"))
        .min(2, t("Fields.Body.Min")),
    }),

    link: z
      .string()
      .min(1, t("Fields.Link.Required"))
      .min(2, t("Fields.Link.Min")),

    type: z.enum(["promo"], t("Fields.Type.Required")),
  });

export type NotificationFormData = z.infer<
  ReturnType<typeof notificationSchema>
>;
