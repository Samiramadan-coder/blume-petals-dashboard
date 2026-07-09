import Statistics from "@/components/customers/statistics";
import { customersPlaceholder } from "@/constants/customers";
import DataPreview from "@/components/customers/data-preview";

export const metadata = {
  title: "Customers",
};

type SearchParams = {
  query?: string;
  status?: string;
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { query, status } = await searchParams;
  console.log("Search Params:", { query, status });

  return (
    <main className="space-y-6">
      <Statistics />

      <DataPreview customers={customersPlaceholder} />
    </main>
  );
}
