import { http } from "@/lib/http";
import { Today } from "@/types/dashboard";
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
    };
  }>("api/v1/admin/dashboard?days=30");

  if (!ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  console.log(data.data.today);

  return (
    <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div>
        <TodaysRevenue today={data.data.today} />
      </div>

      <div>
        <OrdersToday today={data.data.today} />
      </div>

      <div>
        <PendingOrders />
      </div>

      <div>
        <ActiveCustomDesign />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RevenueThisMonth />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <OrdersByChannel />
      </div>

      <div className="md:col-span-2 lg:col-span-3">
        <RecentOrders />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <TopCustomBuilderCombos />
      </div>

      <div className="md:col-span-2 lg:col-span-4">
        <LockStock />
      </div>
    </main>
  );
}
