"use client";

import { cn } from "@/lib/utils";
import LiveDateTime from "./live-date-time";
import { SidebarTrigger } from "../ui/sidebar";
import { LocaleSwitcher } from "./locale-switcher";
import { useLocale, useTranslations } from "next-intl";
import { navigationLabels } from "@/constants/dashboard-layout";
import { usePathname } from "@/i18n/navigation";
import GlobalSearch from "./global-search";
import NotificationsSetup from "./notifications-setup";

export default function DashboardHeader() {
  const locale = useLocale();
  const t = useTranslations("layout");
  const pathname = usePathname();
  const activeLabel = navigationLabels().find((nav) => {
    if (nav.href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(nav.href);
  });

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-primary/30 bg-white px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger
          className="md:hidden"
          aria-label={t("sidebar.toggleExpand")}
          title={t("sidebar.toggleExpand")}
        />

        <p
          className={cn("text-lg font-semibold text-foreground", {
            "font-cairo": locale === "ar",
            "font-heading": locale !== "ar",
          })}
        >
          {activeLabel ? t(activeLabel.label) : ""}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <GlobalSearch />
        <LiveDateTime />
        <LocaleSwitcher />
        <NotificationsSetup />
      </div>
    </header>
  );
}
