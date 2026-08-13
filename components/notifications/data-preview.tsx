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
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className="mb-2 border border-primary/30"
            style={{ boxShadow: "none" }}
          >
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">
                    {notification.title[locale]}
                  </h3>
                  <p>{notification.body[locale]}</p>
                  <p className="underline italic text-primary font-semibold">
                    {notification.user.email}
                  </p>
                  <p className="font-semibold text-primary">
                    {notification.user.name}
                  </p>
                </div>

                <div>{formatDate(notification.created_at)}</div>
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
