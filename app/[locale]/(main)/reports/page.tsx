import ReportsTabs from "@/components/reports/reports-tabs";
import CustomersIndex from "@/components/reports/customers/customers-index";
import SalesRevenueIndex from "@/components/reports/sales-revenue/sales-revenue-index";
import InventoryStockIndex from "@/components/reports/inventory-stock/inventory-stock-index";
import CustomBuilderAnalyticsIndex from "@/components/reports/custom-builder-analytics/custom-builder-analytics-index";
import FiltersControl from "@/components/reports/filters-control";

type SearchParams = {
  tab?: "sales" | "inventory" | "analytics" | "customers";
  days?: string;
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab, days } = await searchParams;

  return (
    <div className="space-y-6">
      <ReportsTabs />
      <FiltersControl />

      {tab === undefined && <SalesRevenueIndex days={days || "30"} />}
      {tab === "inventory" && <InventoryStockIndex days={days || "30"} />}
      {tab === "analytics" && (
        <CustomBuilderAnalyticsIndex days={days || "30"} />
      )}
      {tab === "customers" && <CustomersIndex days={days || "30"} />}
    </div>
  );
}
