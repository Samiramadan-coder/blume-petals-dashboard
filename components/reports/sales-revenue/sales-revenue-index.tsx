import { http } from "@/lib/http";
import { TotalType } from "@/types/reports";
import Totals from "./totals";

export default async function SalesRevenueIndex() {
  const { data, ok } = await http.get<{
    data: {
      totals: TotalType;
    };
  }>("/api/v1/admin/reports/sales");

  if (!ok) {
    throw new Error("Failed to fetch sales revenue data");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
      <Totals totals={data.data.totals} />
    </div>
  );
}
