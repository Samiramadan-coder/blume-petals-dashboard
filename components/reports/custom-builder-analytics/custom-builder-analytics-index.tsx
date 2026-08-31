import { http } from "@/lib/http";
import { Funnel } from "@/types/reports";
import AnalyticsCards from "./analytics-cards";

export default async function CustomBuilderAnalyticsIndex() {
  const { data, ok } = await http.get<{
    data: {
      funnel: Funnel;
    };
  }>("/api/v1/admin/reports/builder");

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  console.log(data.data);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <AnalyticsCards funnel={data.data.funnel} />
    </div>
  );
}
