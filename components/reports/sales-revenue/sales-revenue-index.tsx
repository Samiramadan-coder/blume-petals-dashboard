import {
  ByChannel,
  TotalType,
  ByCategory,
  TopProduct,
  ByFulfillment,
  RevenueOverTimeSerie,
  ByEmirate,
} from "@/types/reports";
import Totals from "./totals";
import { http } from "@/lib/http";
import RevenueOverTime from "./revenue-overtime";
import RevenueByChannel from "./revenue-by-channel";
import RevenueByCategory from "./revenue-by-category";
import RevenueTopProducts from "./revenue-top-products";
import RevenueByDeliveryMethod from "./revenue-by-delivery-method";
import RevenueByEmirate from "./revenue-by-emirate";

export default async function SalesRevenueIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: TotalType;
      revenue_series: RevenueOverTimeSerie[];
      by_channel: ByChannel[];
      by_category: ByCategory[];
      top_products: TopProduct[];
      by_fulfillment: ByFulfillment[];
      by_emirate: ByEmirate[];
    };
  }>("/api/v1/admin/reports/sales");

  if (!ok) {
    throw new Error("Failed to fetch sales revenue data");
  }

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

      <div className="sm:col-span-2 md:col-span-4">
        <RevenueTopProducts topProducts={data.data.top_products} />
      </div>

      <div className="sm:col-span-2 md:col-span-4">
        <RevenueByDeliveryMethod
          revenueByFulfillment={data.data.by_fulfillment}
        />
      </div>

      <div className="sm:col-span-2 md:col-span-4">
        <RevenueByEmirate revenueByEmirate={data.data.by_emirate} />
      </div>
    </div>
  );
}
