"use client";

import { usePermissions } from "@/providers/permission-providers";
import { useLocale, useTranslations } from "next-intl";
import Create from "./create";
import ModuleHeader from "../reusable/module-header";
import { Notification } from "@/types/notifications";
import { Pagination } from "@/types/shared";
import PaginationTemplate from "../reusable/pagination-temlate";
import { cn, formatDate } from "@/lib/utils";
import FiltersControl from "./filters-control";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  Bell,
  BellOff,
  Clock,
  Link2,
  LucideIcon,
  Megaphone,
  Package,
  Settings2,
} from "lucide-react";

const typeStyles = {
  order: {
    icon: Package,
    label: "Filters.Order",
    accent: "bg-primary",
    iconBox: "bg-primary/10 text-primary",
    chip: "bg-primary/10 text-primary",
  },
  promo: {
    icon: Megaphone,
    label: "Filters.Promo",
    accent: "bg-amber-500",
    iconBox: "bg-amber-500/10 text-amber-600",
    chip: "bg-amber-500/10 text-amber-700",
  },
  system: {
    icon: Settings2,
    label: "Filters.System",
    accent: "bg-sky-500",
    iconBox: "bg-sky-500/10 text-sky-600",
    chip: "bg-sky-500/10 text-sky-700",
  },
} as const satisfies Record<
  string,
  {
    icon: LucideIcon;
    label: string;
    accent: string;
    iconBox: string;
    chip: string;
  }
>;

const fallbackStyle = {
  icon: Bell,
  label: null,
  accent: "bg-muted-foreground/40",
  iconBox: "bg-muted text-muted-foreground",
  chip: "bg-muted text-muted-foreground",
};

function NotificationCard({ notification }: { notification: Notification }) {
  const locale = useLocale();
  const t = useTranslations("Notifications");

  const style =
    typeStyles[notification.type as keyof typeof typeStyles] ?? fallbackStyle;
  const Icon = style.icon;
  const { user, link } = notification;
  const isExternalLink = /^https?:\/\//.test(link ?? "");

  return (
    <article className="group relative overflow-hidden rounded-xl border border-primary/20 bg-white p-4 ps-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <span
        aria-hidden
        className={cn("absolute inset-y-0 inset-s-0 w-1", style.accent)}
      />

      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105",
            style.iconBox,
          )}
        >
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold wrap-break-word">
                {notification.title[locale]}
              </h3>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
                  style.chip,
                )}
              >
                {style.label ? t(style.label) : notification.type}
              </span>
              {!!notification.order_number && (
                <span
                  dir="ltr"
                  className="rounded-full border border-primary/20 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground"
                >
                  #{notification.order_number}
                </span>
              )}
            </div>

            <span className="ms-auto flex shrink-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
              <Clock className="size-3" />
              {formatDate(notification.created_at)}
            </span>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line wrap-break-word">
            {notification.body[locale]}
          </p>

          {(user?.name || user?.email || link) && (
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-dashed border-primary/20 pt-3">
              {(user?.name || user?.email) && (
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-xs text-white">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 text-xs">
                    {user.name && (
                      <p className="font-semibold wrap-break-word">
                        {user.name}
                      </p>
                    )}
                    {user.email && (
                      <p className="break-all text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {link &&
                link.includes("http") &&
                (isExternalLink ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="ms-auto flex min-w-0 max-w-full items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <Link2 className="size-3.5 shrink-0" />
                    <span className="truncate">{link}</span>
                  </a>
                ) : (
                  <span
                    dir="ltr"
                    className="ms-auto flex min-w-0 max-w-full items-center gap-1 text-xs font-medium text-muted-foreground"
                  >
                    <Link2 className="size-3.5 shrink-0" />
                    <span className="truncate">{link}</span>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default function DataPreview({
  notifications,
  pagination,
}: {
  notifications: Notification[];
  pagination: Pagination;
}) {
  const { can } = usePermissions();
  const t = useTranslations("Notifications");

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        {can("catalog.create") && <Create />}
      </ModuleHeader>

      <FiltersControl />

      <div className="mb-6 grid gap-3">
        {notifications.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-primary/30 bg-white px-4 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BellOff className="size-6" />
            </div>
            <p className="text-sm text-muted-foreground">{t("Empty")}</p>
          </div>
        )}

        {notifications.map((notification) => (
          <NotificationCard key={notification.id} notification={notification} />
        ))}
      </div>

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}
