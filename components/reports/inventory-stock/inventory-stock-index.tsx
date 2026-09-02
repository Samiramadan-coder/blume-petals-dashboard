import { http } from "@/lib/http";
import InventoryStatsCards from "./inventory-stats";
import {
  BuilderUsage,
  InventoryTotals,
  StockLevel,
  FastestMovingItem,
} from "@/types/reports";
import StockLevels from "./stock-levels";
import FlowerUsageBreakdown from "./flower-usage-break-down";
import FastestMovingItems from "./fastest-moving-items";

export default async function InventoryStockIndex({ days }: { days: string }) {
  const { data, ok } = await http.get<{
    data: {
      totals: InventoryTotals;
      levels: StockLevel[];
      builder_usage: BuilderUsage;
      fastest_moving: { items: FastestMovingItem[] };
    };
  }>("/api/v1/admin/reports/inventory", {
    params: {
      days: days,
    },
  });

  if (!ok) {
    throw new Error("Failed to fetch customer stats data");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <InventoryStatsCards totals={data.data.totals} />

      <div className="sm:col-span-2 md:col-span-4">
        <StockLevels levels={data.data.levels} />
      </div>

      <div className="sm:col-span-2 md:col-span-4">
        <FlowerUsageBreakdown builderUsage={data.data.builder_usage} />
      </div>

      <div className="sm:col-span-2 md:col-span-4">
        <FastestMovingItems fastestMoving={data.data.fastest_moving.items} />
      </div>
    </div>
  );
}
