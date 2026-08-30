import {
  Order,
  Today,
  LowStock,
  TopCombo,
  RevenueSerie,
  OrdersByChannelType,
} from "@/types/dashboard";
import { http } from "@/lib/http";
import LockStock from "@/components/home/lock-stock";
import OrdersToday from "@/components/home/orders-today";
import RecentOrders from "@/components/home/recent-orders";
import PendingOrders from "@/components/home/pending-orders";
import TodaysRevenue from "@/components/home/todays-revenue";
import OrdersByChannel from "@/components/home/orders-by-channel";
import RevenueThisMonth from "@/components/home/revenu-this-month";
import ActiveCustomDesign from "@/components/home/active-custom-design";
import TopCustomBuilderCombos from "@/components/home/top-custom-builder-combos";

export default async function Home() {
  const { data, ok } = await http.get<{
    data: {
      today: Today;
      revenue_series: RevenueSerie[];
      orders_by_channel: OrdersByChannelType;
      recent_orders: Order[];
      top_combos: TopCombo[];
      low_stock: LowStock[];
    };
  }>("api/v1/admin/dashboard?days=30");

  if (!ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  console.log(data.data);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <TodaysRevenue today={data.data.today} />
      </div>

      <div>
        <OrdersToday today={data.data.today} />
      </div>

      <div>
        <PendingOrders today={data.data.today} />
      </div>

      <div>
        <ActiveCustomDesign today={data.data.today} />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RevenueThisMonth revenueThisMonth={data.data.revenue_series} />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <OrdersByChannel ordersByChannel={data.data.orders_by_channel} />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RecentOrders recentOrders={data.data.recent_orders} />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <TopCustomBuilderCombos topCombos={data.data.top_combos} />
      </div>

      <div className="md:col-span-2 lg:col-span-4">
        <LockStock lowStock={data.data.low_stock} />
      </div>
    </main>
  );
}
