import { http } from "@/lib/http";
import {
  CustomerTotalType,
  CustomerGrowthSerie,
  NewVsReturningItem,
  CustomerByEmirateType,
  TopCustomer,
} from "@/types/reports";
import CustomerTotals from "./customer-totals";
import CustomerGrowth from "./customer-growth";
import NewVsReturningCustomers from "./customer-new-vs-returning";
import CustomersByEmirate from "./customers-by-emirate";
import TopCustomers from "./top-customers";

export default async function CustomersIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: CustomerTotalType;
      growth: CustomerGrowthSerie[];
      new_vs_returning: NewVsReturningItem[];
      by_emirate: CustomerByEmirateType[];
      top: TopCustomer[];
    };
  }>("/api/v1/admin/reports/customers");

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  console.log(data.data);
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

      <div className="sm:col-span-2 md:col-span-4">
        <TopCustomers customers={data.data.top} />
      </div>
    </div>
  );
}
