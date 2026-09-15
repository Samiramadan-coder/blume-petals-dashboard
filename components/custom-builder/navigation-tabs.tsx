"use client";

import { useTranslations } from "next-intl";
import { Button } from "../ui/button";
import { Link, usePathname } from "@/i18n/navigation";

export default function NavigationTabs() {
  const pathname = usePathname();
  const t = useTranslations("CustomBuilder.NavigationTabs");
  const isTemplates = pathname === "/templates";
  const isRibbons = pathname === "/templates/ribbons";
  const isCards = pathname === "/templates/cards";

  return (
    <div className="p-1 my-4 w-fit border border-border rounded-xl">
      <Link href="/templates">
        <Button
          className={`px-4 rounded-lg text-[13px] font-semibold ${isTemplates ? "bg-primary text-primary-foreground" : ""}`}
          variant="ghost"
          aria-pressed={isTemplates}
        >
          {t("Templates")}
        </Button>
      </Link>

      <Link href="/templates/ribbons">
        <Button
          className={`px-4 rounded-lg text-[13px] font-semibold ${isRibbons ? "bg-primary text-primary-foreground" : ""}`}
          variant="ghost"
          aria-pressed={isRibbons}
        >
          {t("Ribbons")}
        </Button>
      </Link>

      <Link href="/templates/cards">
        <Button
          className={`px-4 rounded-lg text-[13px] font-semibold ${isCards ? "bg-primary text-primary-foreground" : ""}`}
          variant="ghost"
          aria-pressed={isCards}
        >
          {t("Cards")}
        </Button>
      </Link>
    </div>
  );
}
