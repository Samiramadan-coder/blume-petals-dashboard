import { Suspense } from "react";
import ReportsTabs from "@/components/reports/reports-tabs";
import FiltersControl from "@/components/reports/filters-control";
import { ReportsSkeleton } from "@/components/reusable/page-skeletons";
import CustomersIndex from "@/components/reports/customers/customers-index";
import SalesRevenueIndex from "@/components/reports/sales-revenue/sales-revenue-index";
import InventoryStockIndex from "@/components/reports/inventory-stock/inventory-stock-index";
import CustomBuilderAnalyticsIndex from "@/components/reports/custom-builder-analytics/custom-builder-analytics-index";

type SearchParams = {
  tab?: string;
  days?: string;
  compare?: string;
  from?: string;
  to?: string;
};

// The presets offered by the period select
const periods = ["1", "7", "30", "60"];

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab, days, compare, from, to } = await searchParams;

  const filters = {
    days: days && periods.includes(days) ? days : "30",
    compare,
    // A custom range only applies once both ends are picked
    from: from && to ? from : undefined,
    to: from && to ? to : undefined,
  };

  return (
    <div className="space-y-6">
      <ReportsTabs />
      <FiltersControl />

      {/* The key shows the loading state again whenever a tab or filter changes */}
      <Suspense
        key={JSON.stringify([tab, filters])}
        fallback={<ReportsSkeleton />}
      >
        {tab === "inventory" ? (
          <InventoryStockIndex {...filters} />
        ) : tab === "analytics" ? (
          <CustomBuilderAnalyticsIndex {...filters} />
        ) : tab === "customers" ? (
          <CustomersIndex {...filters} />
        ) : (
          // "sales", no tab at all, or an unknown value
          <SalesRevenueIndex {...filters} />
        )}
      </Suspense>
    </div>
  );
}
