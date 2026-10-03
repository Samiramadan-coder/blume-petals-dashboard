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
    <div className="p-0.5 my-4 w-fit border border-border rounded-lg bg-white">
      <Button
        asChild
        className={`px-4 min-w-25 rounded-sm text-[13px] font-semibold hover:bg-primary hover:text-primary-foreground ${isTemplates ? "bg-primary text-primary-foreground" : ""}`}
        variant="ghost"
      >
        <Link href="/templates" aria-current={isTemplates ? "page" : undefined}>
          {t("Templates")}
        </Link>
      </Button>

      <Button
        asChild
        className={`px-4 min-w-25 rounded-sm text-[13px] font-semibold hover:bg-primary hover:text-primary-foreground ${isRibbons ? "bg-primary text-primary-foreground" : ""}`}
        variant="ghost"
      >
        <Link
          href="/templates/ribbons"
          aria-current={isRibbons ? "page" : undefined}
        >
          {t("Ribbons")}
        </Link>
      </Button>

      <Button
        asChild
        className={`px-4 min-w-25 rounded-sm text-[13px] font-semibold hover:bg-primary hover:text-primary-foreground ${isCards ? "bg-primary text-primary-foreground" : ""}`}
        variant="ghost"
      >
        <Link
          href="/templates/cards"
          aria-current={isCards ? "page" : undefined}
        >
          {t("Cards")}
        </Link>
      </Button>
    </div>
  );
}
