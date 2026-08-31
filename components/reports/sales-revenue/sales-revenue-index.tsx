import {
  ByChannel,
  RevenueOverTimeSerie,
  TotalType,
  ByCategory,
} from "@/types/reports";
import Totals from "./totals";
import { http } from "@/lib/http";
import RevenueOverTime from "./revenue-overtime";
import RevenueByChannel from "./revenue-by-channel";
import RevenueByCategory from "./revenue-by-category";

export default async function SalesRevenueIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: TotalType;
      revenue_series: RevenueOverTimeSerie[];
      by_channel: ByChannel[];
      by_category: ByCategory[];
    };
  }>("/api/v1/admin/reports/sales");

  if (!ok) {
    throw new Error("Failed to fetch sales revenue data");
  }

  console.log(data.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <Totals totals={data.data.totals} />

      <div className="sm:col-span-2 md:col-span-4">
        <RevenueOverTime revenueOverTime={data.data.revenue_series} />
      </div>

      <div className="sm:col-span-2">
        <RevenueByChannel revenueByChannel={data.data.by_channel} />
      </div>

      <div className="sm:col-span-2">
        <RevenueByCategory revenueByCategory={data.data.by_category} />
      </div>
    </div>
  );
}
