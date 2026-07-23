import { http } from "@/lib/http";
import { Pagination } from "@/types/shared";
import { Order, Summary } from "@/types/orders";
import Statistics from "@/components/orders/statistics";
import DataPreview from "@/components/orders/data-preview";

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

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { status, query, dateFrom, dateTo, page } = await searchParams;

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
