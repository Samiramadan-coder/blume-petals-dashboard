import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { NotificationsSkeleton } from "@/components/reusable/page-skeletons";
import { Notification } from "@/types/notifications";
import DataPreview from "@/components/notifications/data-preview";

type SearchParams = {
  page?: string;
  type?: string;
};

const notificationTypes = ["order", "promo", "system"];

async function NotificationsList({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Anything else (missing, "all", hand-typed values) means no type filter
  const type =
    searchParams?.type && notificationTypes.includes(searchParams.type)
      ? searchParams.type
      : "";

  const { data, ok } = await http.get<{
    data: {
      items: Notification[];
      pagination: Pagination;
    };
  }>("/api/v1/admin/notifications", {
    params: {
      per_page: 6,
      page: searchParams?.page || 1,
      type,
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch notifications");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        notifications={data.data.items}
        pagination={data.data.pagination}
      />
    </main>
  );
}

export default async function NotificationsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<NotificationsSkeleton />}>
      <NotificationsList searchParams={await searchParams} />
    </Suspense>
  );
}
