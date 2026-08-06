import z from "zod";
import { LocaleObj } from "./shared";

export const settingsSchema = z.object({
  about_us: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  terms_and_conditions: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  policy: z.object({
    en: z.string(),
    ar: z.string(),
  }),
  logo_url: z.union([z.string(), z.instanceof(Blob)]),
});

export type SettingsSchema = z.infer<typeof settingsSchema>;

export type Settings = {
  about_us: LocaleObj;
  terms_and_conditions: LocaleObj;
  policy: LocaleObj;
  logo_url: string;
};
