"use client";

import { usePermissions } from "@/providers/permission-providers";
import { useLocale, useTranslations } from "next-intl";
import Create from "./create";
import ModuleHeader from "../reusable/module-header";
import { Notification } from "@/types/notifications";
import { Pagination } from "@/types/shared";
import { Card, CardContent } from "../ui/card";
import PaginationTemplate from "../reusable/pagination-temlate";
import { formatDate } from "@/lib/utils";
import FiltersControl from "./filters-control";

export default function DataPreview({
  notifications,
  pagination,
}: {
  notifications: Notification[];
  pagination: Pagination;
}) {
  const locale = useLocale();
  const { can } = usePermissions();
  const t = useTranslations("Notifications");

  return (
    <>
      <ModuleHeader title={t("Title")} description={t("Description")}>
        {can("catalog.create") && <Create />}
      </ModuleHeader>

      <FiltersControl />

      <div className="mb-6">
        {notifications.length === 0 && (
          <p className="rounded-lg border border-primary/30 bg-white px-4 py-10 text-center text-sm text-muted-foreground">
            {t("Empty")}
          </p>
        )}

        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="mb-2 border border-primary/30"
            style={{ boxShadow: "none" }}
          >
            <CardContent>
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                <div className="min-w-0 space-y-1">
                  <h3 className="text-sm font-semibold wrap-break-word">
                    {notification.title[locale]}
                  </h3>
                  <p className="whitespace-pre-line wrap-break-word">
                    {notification.body[locale]}
                  </p>
                  {notification.user?.email && (
                    <p className="underline italic text-primary font-semibold break-all">
                      {notification.user.email}
                    </p>
                  )}
                  {notification.user?.name && (
                    <p className="font-semibold text-primary">
                      {notification.user.name}
                    </p>
                  )}
                </div>

                <div className="shrink-0">
                  {formatDate(notification.created_at)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <PaginationTemplate
        currentPage={pagination.current_page}
        totalPages={pagination.last_page}
      />
    </>
  );
}
