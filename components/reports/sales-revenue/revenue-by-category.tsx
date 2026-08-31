"use client";

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  LabelList,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useTranslations } from "next-intl";

import { ByCategory } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

function formatCompact(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`;
  }

  return value.toString();
}

function RevenueLabel({
  x,
  y,
  width,
  height,
  value,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  value?: number;
}) {
  if (
    x === undefined ||
    y === undefined ||
    width === undefined ||
    height === undefined ||
    value === undefined
  ) {
    return null;
  }

  return (
    <text
      x={x + width + 6}
      y={y + height / 2}
      dominantBaseline="middle"
      className="fill-muted-foreground text-[10px]"
    >
      AED {formatCompact(value)}
    </text>
  );
}

export default function RevenueByCategory({
  revenueByCategory,
}: {
  revenueByCategory: ByCategory[];
}) {
  const t = useTranslations("Reports.SalesRevenue");
  const tCommon = useTranslations("Common");

  const data = revenueByCategory
    .map((item) => ({
      slug: item.slug,
      category: item.category,
      orders: Number(item.orders),
      units: Number(item.units),
      revenue: Number(item.revenue),
      share_pct: Number(item.share_pct),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("RevenueByCategory")}
          </p>

          <p className="mt-1 text-xl font-semibold text-foreground">
            {t("CategoriesCount", {
              count: data.length,
            })}
          </p>
        </header>

        <div className="mt-5 h-67.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 0,
                right: 70,
                bottom: 0,
                left: 0,
              }}
              barCategoryGap={10}
            >
              <CartesianGrid
                horizontal={false}
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.5}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
                tickFormatter={(value) => formatCompact(Number(value))}
              />

              <YAxis
                type="category"
                dataKey="category"
                axisLine={false}
                tickLine={false}
                width={110}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />

              <Tooltip
                cursor={{
                  fill: "var(--primary)",
                  fillOpacity: 0.05,
                }}
                content={({ active, payload }) => {
                  if (!active || !payload?.length) {
                    return null;
                  }

                  const item = payload[0].payload as (typeof data)[number];

                  return (
                    <div className="min-w-44 rounded-lg border border-primary/20 bg-background p-3 shadow-md">
                      <p className="mb-2 text-sm font-semibold text-foreground">
                        {item.category}
                      </p>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Revenue")}
                          </span>

                          <span className="font-medium text-foreground">
                            {tCommon("AED")} {item.revenue.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Orders")}
                          </span>

                          <span className="font-medium text-foreground">
                            {item.orders}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Units")}
                          </span>

                          <span className="font-medium text-foreground">
                            {item.units}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Share")}
                          </span>

                          <span className="font-medium text-foreground">
                            {item.share_pct}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="revenue"
                fill="var(--primary)"
                radius={[0, 8, 8, 0]}
                barSize={14}
              >
                <LabelList dataKey="revenue" content={<RevenueLabel />} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
