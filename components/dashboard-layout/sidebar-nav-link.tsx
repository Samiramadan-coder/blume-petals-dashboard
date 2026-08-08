"use client";

import { SidebarMenuButton } from "../ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { DashboardNavigationLinkItem } from "@/types/dashboard-layout";

export default function SidebarNavLink({
  item,
}: {
  item: DashboardNavigationLinkItem;
}) {
  const pathname = usePathname();
  const t = useTranslations("layout");
  const normalizedPathname = pathname.replace(/^\/(en|ar)(?=\/|$)/, "") || "/";
  const isActive =
    item.href === "/"
      ? normalizedPathname === "/"
      : normalizedPathname === item.href ||
        normalizedPathname.startsWith(`${item.href}/`);

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      className="relative rounded-lg h-10 px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/12 data-[active=true]:text-primary"
    >
      <Link href={item.href} className="flex items-center gap-3">
        {item.icon}
        <span>{t(item.label)}</span>
      </Link>
    </SidebarMenuButton>
  );
}
