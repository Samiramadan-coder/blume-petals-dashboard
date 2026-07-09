import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "en",
  // Use 'as-needed' so default locale is served at `/` and
  // non-default locales are prefixed (e.g. `/en`).
  localePrefix: "as-needed",
});
