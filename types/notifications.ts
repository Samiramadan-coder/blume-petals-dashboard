import z from "zod";
import { LocaleObj, T } from "./shared";

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

    link: z.string(),

    type: z.enum(["promo", "system"], t("Fields.Type.Required")),
  });

export type NotificationFormData = z.infer<
  ReturnType<typeof notificationSchema>
>;

export type Notification = {
  created_at: string;
  id: string;
  link: string;
  order_id: number;
  order_number: number;
  read: boolean;
  read_at: string | null;
  type: string;
  body: LocaleObj;
  title: LocaleObj;
  user: {
    id: "f3e1c5a0-7d4b-4f8e-9c6b-2e1f3a5b6c7d";
    name: string;
    email: string;
  };
};
