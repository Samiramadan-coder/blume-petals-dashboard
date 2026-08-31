"use client";

import {
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerByEmirateType } from "@/types/reports";

export default function CustomersByEmirate({
  customersByEmirate,
}: {
  customersByEmirate: CustomerByEmirateType[];
}) {
  const t = useTranslations("Reports.CustomerStats");
  const locale = useLocale();

  const data = customersByEmirate.map((emirate) => {
    return {
      name: locale === "ar" ? emirate.name_ar : emirate.name_en,
      customers: Number(emirate?.customers ?? 0),
      share_pct: Number(emirate?.share_pct ?? 0),
    };
  });

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("CustomersByEmirate")}
        </p>

        <div className="mt-5 h-62.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{
                top: 0,
                right: 20,
                bottom: 0,
                left: 20,
              }}
              barCategoryGap={12}
            >
              <CartesianGrid
                horizontal
                vertical
                strokeDasharray="3 3"
                stroke="var(--border)"
                opacity={0.4}
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                tick={{
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />

              <YAxis
                type="category"
                dataKey="name"
                axisLine={false}
                tickLine={false}
                width={100}
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
                    <div className="min-w-36 rounded-lg border border-primary/20 bg-background p-3 shadow-md">
                      <p className="mb-2 text-sm font-semibold">{item.name}</p>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Customers")}
                          </span>

                          <span className="font-medium">{item.customers}</span>
                        </div>

                        <div className="flex justify-between gap-5">
                          <span className="text-muted-foreground">
                            {t("Share")}
                          </span>

                          <span className="font-medium">{item.share_pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />

              <Bar
                dataKey="customers"
                fill="#849982"
                radius={[0, 5, 5, 0]}
                barSize={4}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
