"use client";

import { cn } from "@/lib/utils";
import { usePermissions } from "@/providers/permission-providers";
import { useLocale, useTranslations } from "next-intl";
import Create from "./create";

export default function DataPreview() {
  const locale = useLocale();
  const t = useTranslations("Notifications");
  const { can } = usePermissions();

  return (
    <>
      <header className="flex items-center justify-between">
        <div>
          <h1
            className={cn("text-2xl font-semibold text-foreground", {
              "font-cairo": locale === "ar",
              "font-heading": locale !== "ar",
            })}
          >
            {t("Title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t("Description")}
          </p>
        </div>

        {can("catalog.create") && <Create />}
      </header>
    </>
  );
}
