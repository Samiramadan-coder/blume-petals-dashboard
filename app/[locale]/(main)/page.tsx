import {
  Order,
  Today,
  LowStock,
  TopCombo,
  RevenueSerie,
  OrdersByChannelType,
} from "@/types/dashboard";
import { Suspense } from "react";
import { http } from "@/lib/http";
import LockStock from "@/components/home/lock-stock";
import OrdersToday from "@/components/home/orders-today";
import RecentOrders from "@/components/home/recent-orders";
import PendingOrders from "@/components/home/pending-orders";
import TodaysRevenue from "@/components/home/todays-revenue";
import OrdersByChannel from "@/components/home/orders-by-channel";
import RevenueThisMonth from "@/components/home/revenu-this-month";
import { HomeSkeleton } from "@/components/reusable/page-skeletons";
import ActiveCustomDesign from "@/components/home/active-custom-design";
import TopCustomBuilderCombos from "@/components/home/top-custom-builder-combos";

async function Dashboard() {
  const { data, ok } = await http.get<{
    data: {
      today: Today;
      revenue_series: RevenueSerie[];
      orders_by_channel: OrdersByChannelType;
      recent_orders: Order[];
      top_combos: TopCombo[];
      low_stock: LowStock[];
    };
  }>("/api/v1/admin/dashboard", {
    params: {
      days: 30,
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  // Any list may be missing from the response, the widgets render them empty
  const {
    today,
    revenue_series = [],
    orders_by_channel,
    recent_orders = [],
    top_combos = [],
    low_stock = [],
  } = data.data;

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <TodaysRevenue today={today} />
      </div>

      <div>
        <OrdersToday today={today} />
      </div>

      <div>
        <PendingOrders today={today} />
      </div>

      <div>
        <ActiveCustomDesign today={today} />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RevenueThisMonth revenueThisMonth={revenue_series ?? []} />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <OrdersByChannel ordersByChannel={orders_by_channel} />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RecentOrders recentOrders={recent_orders ?? []} />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <TopCustomBuilderCombos topCombos={top_combos ?? []} />
      </div>

      <div className="md:col-span-2 lg:col-span-4">
        <LockStock lowStock={low_stock ?? []} />
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <Dashboard />
    </Suspense>
  );
}
