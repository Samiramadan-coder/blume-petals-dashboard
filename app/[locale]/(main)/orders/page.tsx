import { Suspense } from "react";
import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Order, Summary } from "@/types/orders";
import Statistics from "@/components/orders/statistics";
import DataPreview from "@/components/orders/data-preview";
import OrdersSkeleton from "@/components/orders/orders-skeleton";

export const metadata = {
  title: "Orders",
};

type SearchParams = {
  status?: string;
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

async function OrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const { status, query, dateFrom, dateTo, page } = await searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: Order[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/orders", {
    next: {
      revalidate: 60,
      tags: ["orders"],
    },
    params: {
      page: page || 1,
      per_page: 10,
      q: query || "",
      status: status || "",
      date_from: dateFrom || "",
      date_to: dateTo || "",
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch orders");
  }

  return (
    <main className="space-y-6">
      <Statistics summary={data.data.summary} />
      <DataPreview orders={data.data.items} pagination={data.data.pagination} />
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
      <OrdersPage searchParams={await searchParams} />;
    </Suspense>
  );
}
