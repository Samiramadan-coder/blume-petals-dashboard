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
import { useTranslations } from "next-intl";
import { CustomerGrowthSerie } from "@/types/reports";
import { formatCompactNumber, getSpreadTicks } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerGrowth({
  customerGrowths = [],
}: {
  customerGrowths: CustomerGrowthSerie[];
}) {
  const t = useTranslations("Reports.CustomerStats");

  return (
    <Card className="h-full ring-0! border border-primary/30">
      <CardContent>
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {t("CustomerGrowth")}
            </p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={customerGrowths}
              margin={{
                top: 4,
                right: 4,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="customerGrowthGradient"
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
                ticks={getSpreadTicks(customerGrowths.map((item) => item.date))}
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
                allowDecimals={false}
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
                  `${Number(value).toLocaleString()}`,
                  t("NewCustomers"),
                ]}
                labelStyle={{
                  color: "#111",
                  marginBottom: 4,
                }}
              />

              <Area
                type="monotone"
                dataKey="new_customers"
                stroke="#cbb682"
                strokeWidth={2}
                fill="url(#customerGrowthGradient)"
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
