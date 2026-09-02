import {
  CustomerTotalType,
  CustomerGrowthSerie,
  NewVsReturningItem,
  CustomerByEmirateType,
  TopCustomer,
  CustomerByChannel,
} from "@/types/reports";
import { http } from "@/lib/http";
import TopCustomers from "./top-customers";
import CustomerTotals from "./customer-totals";
import CustomerGrowth from "./customer-growth";
import CustomersByEmirate from "./customers-by-emirate";
import NewVsReturningCustomers from "./customer-new-vs-returning";
import NewCustomerAcquisitionChannel from "./new-customers-aquasitions-channel";

export default async function CustomersIndex({
  days,
  compare,
  from,
  to,
}: {
  days: string;
  compare?: string;
  from?: string;
  to?: string;
}) {
  const { data, ok } = await http.get<{
    data: {
      totals: CustomerTotalType;
      growth: CustomerGrowthSerie[];
      new_vs_returning: NewVsReturningItem[];
      by_emirate: CustomerByEmirateType[];
      top: TopCustomer[];
      by_channel: CustomerByChannel[];
    };
  }>("/api/v1/admin/reports/customers", {
    params: {
      days: days,
      ...(compare ? { compare } : {}),
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <CustomerTotals totals={data.data.totals} />

      <div className="sm:col-span-2 md:col-span-4">
        <CustomerGrowth customerGrowths={data.data.growth} />
      </div>

      <div className="sm:col-span-2">
        <NewVsReturningCustomers newVsReturning={data.data.new_vs_returning} />
      </div>

      <div className="sm:col-span-2">
        <CustomersByEmirate customersByEmirate={data.data.by_emirate} />
      </div>

      <div className="sm:col-span-2">
        <TopCustomers customers={data.data.top} />
      </div>

      <div className="sm:col-span-2">
        <NewCustomerAcquisitionChannel byChannel={data.data.by_channel} />
      </div>
    </div>
  );
}
