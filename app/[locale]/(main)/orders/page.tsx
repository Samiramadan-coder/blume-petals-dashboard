import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Order, Summary } from "@/types/orders";
import { OrdersSkeleton } from "@/components/reusable/page-skeletons";
import { getTranslations } from "next-intl/server";
import DataPreview from "@/components/orders/data-preview";

export async function generateMetadata() {
  const t = await getTranslations("Orders");
  return {
    title: t("Label"),
  };
}

type SearchParams = {
  status?: string;
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
  channel?: string;
};

const orderStatuses = [
  "pending",
  "processing",
  "shipped",
  "ready_for_pickup",
  "delivered",
  "cancelled",
];

async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status, query, dateFrom, dateTo, page, channel } = searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: Order[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/orders", {
    next: {
      tags: ["orders"],
    },
    params: {
      page: page || 1,
      per_page: 8,
      q: query || "",
      // Anything else (missing, "all", hand-typed values) means no filter
      status: status && orderStatuses.includes(status) ? status : "",
      date_from: dateFrom || "",
      date_to: dateTo || "",
      channel: channel || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch orders");
  }

  return (
    <main className="space-y-6">
      <DataPreview
        orders={data.data.items}
        pagination={data.data.pagination}
        summary={data.data.summary}
      />
    </main>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<OrdersSkeleton />}>
      <OrdersPage searchParams={await searchParams} />
    </Suspense>
  );
}
