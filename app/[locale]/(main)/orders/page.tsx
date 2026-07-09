import Statistics from "@/components/orders/statistics";
import DataPreview from "@/components/orders/data-preview";

export const metadata = {
  title: "Orders",
};

type SearchParams = {
  status?: string;
  query?: string;
  channel?: string;
  dateFrom?: string;
  dateTo?: string;
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { status, query, channel, dateFrom, dateTo } = await searchParams;

  console.log("Status", status);
  console.log("Query", query);
  console.log("Channel", channel);
  console.log("Date From", dateFrom);
  console.log("Date To", dateTo);

  return (
    <main className="space-y-6">
      <Statistics />
      <DataPreview />
    </main>
  );
}
