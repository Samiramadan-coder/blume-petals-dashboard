import { http } from "@/lib/http";
import { CustomerTotalType } from "@/types/reports";
import CustomerTotals from "./customer-totals";

export default async function CustomersIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: CustomerTotalType;
    };
  }>("/api/v1/admin/reports/customers");

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  console.log(data.data);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <CustomerTotals totals={data.data.totals} />
    </div>
  );
}
