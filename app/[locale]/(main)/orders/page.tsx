import Statistics from "@/components/orders/statistics";
import DataPreview from "@/components/orders/data-preview";
import { http } from "@/lib/http";
import { Order, Summary } from "@/types/orders";
import { Pagination } from "@/types/shared";

export const metadata = {
  title: "Orders",
};

type SearchParams = {
  status?: string;
  query?: string;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, query, channel, dateFrom, dateTo } = await searchParams;

  const { data, ok } = await http.get<{
    data: {
      items: Order[];
      pagination: Pagination;
      summary: Summary;
    };
  }>("/api/v1/admin/orders", {
    params: {
      page: searchParams.page || 1,
      per_page: 10,
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch orders");
  }

  console.log("Data", data);

  // console.log("Status", status);
  // console.log("Query", query);
  // console.log("Channel", channel);
  // console.log("Date From", dateFrom);
  // console.log("Date To", dateTo);

  return (
    <main className="space-y-6">
      <Statistics summary={data.data.summary} />
      <DataPreview orders={data.data.items} pagination={data.data.pagination} />
    </main>
  );
}
