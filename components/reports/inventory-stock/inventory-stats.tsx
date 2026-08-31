"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Boxes, Layers3, PackageX, TriangleAlert } from "lucide-react";
import { InventoryTotals } from "@/types/reports";

export default function InventoryStatsCards({
  totals,
}: {
  totals: InventoryTotals;
}) {
  const t = useTranslations("Reports.InventoryStock");
  const tCommon = useTranslations("Common");

  return (
    <>
      {/* Total Stock Value */}
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("TotalStockValue")}
              </p>

              <p className="mt-5 text-2xl font-semibold text-foreground tabular-nums">
                {tCommon("AED")} {Number(totals.stock_value).toLocaleString()}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {t("ItemsTracked", {
                  count: totals.skus,
                })}
              </p>
            </div>

            <div className="grid size-9 shrink-0 place-content-center rounded-lg bg-primary/10">
              <Layers3 className="size-4 text-primary" />
            </div>
          </header>
        </CardContent>
      </Card>

      {/* Low Stock */}
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("LowStockItems")}
              </p>

              <p className="mt-5 text-2xl font-semibold text-red-400 tabular-nums">
                {totals.low_stock}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {t("BelowReorderThreshold")}
              </p>
            </div>

            <div className="grid size-9 shrink-0 place-content-center rounded-lg bg-red-500/10">
              <TriangleAlert className="size-4 text-red-400" />
            </div>
          </header>
        </CardContent>
      </Card>

      {/* Out Of Stock */}
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("OutOfStock")}
              </p>

              <p className="mt-5 text-2xl font-semibold text-red-600 tabular-nums">
                {totals.out_of_stock}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {t("ItemsUnavailable")}
              </p>
            </div>

            <div className="grid size-9 shrink-0 place-content-center rounded-lg bg-red-500/10">
              <PackageX className="size-4 text-red-500" />
            </div>
          </header>
        </CardContent>
      </Card>

      {/* Total Units */}
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <header className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t("TotalUnits")}
              </p>

              <p className="mt-5 text-2xl font-semibold text-foreground tabular-nums">
                {totals.units.toLocaleString()}
              </p>

              <p className="mt-3 text-xs text-muted-foreground">
                {t("UnitsInInventory")}
              </p>
            </div>

            <div className="grid size-9 shrink-0 place-content-center rounded-lg bg-green-700/10">
              <Boxes className="size-4 text-green-700" />
            </div>
          </header>
        </CardContent>
      </Card>
    </>
  );
}
