"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BuilderUsage } from "@/types/reports";

export default function FlowerUsageBreakdown({
  builderUsage,
}: {
  builderUsage: BuilderUsage;
}) {
  const t = useTranslations("Reports.InventoryStock");
  const locale = useLocale();

  const data = [...builderUsage.flowers]
    .map((item) => ({
      ...item,
      name: locale === "ar" && item.name_ar ? item.name_ar : item.name_en,
      units: Number(item.units),
      share_pct: Number(item.share_pct),
      available: Number(item.available),
    }))
    .sort((a, b) => b.units - a.units);

  // const maxUnits = Math.max(...data.map((item) => item.units), 1);

  return (
    <Card className="overflow-hidden border border-primary/30 ring-0!">
      <CardContent>
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("FlowerUsageBreakdown")}
          </p>

          <p className="mt-1 text-xl font-semibold text-foreground">
            {t("CustomBuilderThisPeriod")}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {t("FlowerUsageDescription")}
          </p>
        </header>

        <div className="mt-5 h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.45}
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "var(--primary)",
                  fillOpacity: 0.04,
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const item = payload[0].payload as (typeof data)[number];

                  return (
                    <div className="min-w-40 rounded-lg border border-primary/20 bg-background p-3 shadow-md">
                      <p className="mb-2 text-sm font-semibold">{item.name}</p>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("StemsUsed")}
                          </span>

                          <span className="font-medium">{item.units}</span>
                        </div>

                        <div className="flex justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Share")}
                          </span>

                          <span className="font-medium">{item.share_pct}%</span>
                        </div>

                        <div className="flex justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Available")}
                          </span>

                          <span className="font-medium">{item.available}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="units"
                fill="var(--primary)"
                radius={[7, 7, 0, 0]}
                barSize={20}
              >
                <LabelList
                  dataKey="units"
                  position="top"
                  className="fill-muted-foreground text-[10px]"
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-5 border-t pt-2">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-60 text-xs">
                  {t("Flower")}
                </TableHead>

                <TableHead className="text-xs">{t("StemsUsed")}</TableHead>

                <TableHead className="text-xs">{t("Available")}</TableHead>

                <TableHead className="min-w-55 text-xs">
                  {t("UsageShare")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((item) => (
                <TableRow key={item.variant_id}>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>

                      <p className="text-[10px] text-muted-foreground">
                        {item.sku}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="font-medium tabular-nums">
                    {item.units}
                  </TableCell>

                  <TableCell className="tabular-nums">
                    {item.available}
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-xs text-muted-foreground tabular-nums">
                        {item.share_pct}%
                      </span>

                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.min(item.share_pct, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4 text-xs">
          <span className="text-muted-foreground">{t("TotalStemsUsed")}</span>

          <span className="font-semibold tabular-nums">
            {builderUsage.total_stems.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
