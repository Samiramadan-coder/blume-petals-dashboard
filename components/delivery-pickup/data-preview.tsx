"use client";

import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import CreateEdit from "./create-edit";
import { City } from "@/types/countries-cities";

export default function DataPreview({ cities }: { cities: City[] }) {
  const t = useTranslations("DeliveryPickupLocations");
  const locale = useLocale();

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
        <CreateEdit cities={cities} />
      </header>
    </>
  );
}
