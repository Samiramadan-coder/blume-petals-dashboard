import { http } from "@/lib/http";
import { RevenueOverTimeSerie, TotalType } from "@/types/reports";
import Totals from "./totals";
import RevenueOverTime from "./revenue-overtime";

export default async function SalesRevenueIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: TotalType;
      revenue_series: RevenueOverTimeSerie[];
    };
  }>("/api/v1/admin/reports/sales");

  if (!ok) {
    throw new Error("Failed to fetch sales revenue data");
  }

  console.log(data.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      <Totals totals={data.data.totals} />

      <div className="sm:col-span-2 md:col-span-4">
        <RevenueOverTime revenueOverTime={data.data.revenue_series} />
      </div>
    </div>
  );
}
