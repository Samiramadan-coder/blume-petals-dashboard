"use client";

import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "../ui/badge";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";
import { RevenueSerie } from "@/types/dashboard";
import { formatCompactNumber, getSpreadTicks } from "@/lib/utils";

export default function RevenueThisMonth({
  revenueThisMonth = [],
}: {
  revenueThisMonth: RevenueSerie[];
}) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const totalRevenue = revenueThisMonth.reduce(
    (acc, curr) => acc + +curr.revenue,
    0,
  );

  return (
    <Card className="h-full ring-0! border border-primary/30">
      <CardContent>
        <div className="mb-4 flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("RevenueThisMonth")}
            </p>

            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {tCommon("AED")} {totalRevenue.toLocaleString()}
            </h3>
          </div>

          <Badge className="text-primary bg-primary/10 h-7 shrink-0">
            {t("Last30Days")}
          </Badge>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueThisMonth}
              margin={{
                top: 4,
                right: 4,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="homeRevenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#cbb682" stopOpacity={0.16} />
                  <stop offset="100%" stopColor="#cbb682" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="#eee9e2"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="date"
                ticks={getSpreadTicks(
                  revenueThisMonth.map((item) => item.date),
                )}
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{
                  fontSize: 11,
                  fill: "#7f746d",
                }}
              />

              <YAxis
                domain={[0, "auto"]}
                width={48}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                tickFormatter={(value) => formatCompactNumber(Number(value))}
                tick={{
                  fontSize: 11,
                  fill: "#7f746d",
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "#cbb682",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid #eee9e2",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  fontSize: 12,
                }}
                formatter={(value) => [
                  `${tCommon("AED")} ${Number(value).toLocaleString()}`,
                  t("Revenue"),
                ]}
                labelStyle={{
                  color: "#111",
                  marginBottom: 4,
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#cbb682"
                strokeWidth={2}
                fill="url(#homeRevenueGradient)"
                fillOpacity={1}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#cbb682",
                  stroke: "#ffffff",
                  strokeWidth: 2,
                }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
