import ReportsTabs from "@/components/reports/reports-tabs";
import CustomersIndex from "@/components/reports/customers/customers-index";
import SalesRevenueIndex from "@/components/reports/sales-revenue/sales-revenue-index";
import InventoryStockIndex from "@/components/reports/inventory-stock/inventory-stock-index";
import CustomBuilderAnalyticsIndex from "@/components/reports/custom-builder-analytics/custom-builder-analytics-index";

type SearchParams = {
  tab?: "sales" | "inventory" | "analytics" | "customers";
};

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab } = await searchParams;

  return (
    <div className="space-y-6">
      <ReportsTabs />

      {tab === undefined && <SalesRevenueIndex />}

      {tab === "inventory" && <InventoryStockIndex />}

      {tab === "analytics" && <CustomBuilderAnalyticsIndex />}

      {tab === "customers" && <CustomersIndex />}
    </div>
  );
}
