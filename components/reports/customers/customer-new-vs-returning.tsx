"use client";

import {
  Pie,
  Sector,
  Tooltip,
  PieChart,
  ResponsiveContainer,
  PieSectorShapeProps,
} from "recharts";
import { useTranslations } from "next-intl";
import { NewVsReturningItem } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

type ChartItem = {
  group: "new" | "returning";
  label: string;
  customers: number;
  orders: number;
  revenue: number;
  percent: number;
  color: string;
};

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as ChartItem;
  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={3} />
  );
}

export default function NewVsReturningCustomers({
  newVsReturning,
}: {
  newVsReturning: NewVsReturningItem[];
}) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Reports.CustomerStats");
  const newCustomers = newVsReturning.find((item) => item.group === "new");
  const returningCustomers = newVsReturning.find(
    (item) => item.group === "returning",
  );

  const data: ChartItem[] = [
    {
      group: "new",
      label: t("NewCustomers"),
      customers: Number(newCustomers?.customers ?? 0),
      orders: Number(newCustomers?.orders ?? 0),
      revenue: Number(newCustomers?.revenue ?? 0),
      percent: Number(newCustomers?.share_pct ?? 0),
      color: "#7f967b",
    },
    {
      group: "returning",
      label: t("ReturningCustomers"),
      customers: Number(returningCustomers?.customers ?? 0),
      orders: Number(returningCustomers?.orders ?? 0),
      revenue: Number(returningCustomers?.revenue ?? 0),
      percent: Number(returningCustomers?.share_pct ?? 0),
      color: "#cbb682",
    },
  ];

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("NewVsReturningCustomers")}
        </p>

        <div className="mt-6 grid grid-cols-[320px_1fr] items-center gap-8">
          <div className="h-47.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={82}
                  paddingAngle={2}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#ffffff"
                  strokeWidth={3}
                  shape={DonutSlice}
                />

                <Tooltip
                  cursor={false}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) {
                      return null;
                    }

                    const item = payload[0].payload as ChartItem;

                    return (
                      <div className="min-w-40 rounded-lg border border-primary/20 bg-background p-3 shadow-md">
                        <p className="mb-2 text-sm font-semibold text-foreground">
                          {item.label}
                        </p>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Customers")}
                            </span>

                            <span className="font-medium">
                              {item.customers}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Orders")}
                            </span>

                            <span className="font-medium">{item.orders}</span>
                          </div>

                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Revenue")}
                            </span>

                            <span className="font-medium">
                              {tCommon("AED")} {item.revenue.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Share")}
                            </span>

                            <span className="font-medium">{item.percent}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-5">
            {data.map((item) => (
              <div key={item.group}>
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                </div>

                <div className="mt-2 space-y-1 pl-5">
                  <div className="flex items-center justify-between gap-6 text-xs">
                    <span className="text-muted-foreground">
                      {t("Customers")}:
                    </span>

                    <span className="font-semibold">
                      {item.customers} ({item.percent}%)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-6 text-xs">
                    <span className="text-muted-foreground">
                      {t("Orders")}:
                    </span>

                    <span className="font-semibold">{item.orders}</span>
                  </div>

                  <div className="flex items-center justify-between gap-6 text-xs">
                    <span className="text-muted-foreground">
                      {t("Revenue")}:
                    </span>

                    <span className="font-semibold">
                      {tCommon("AED")} {item.revenue.toLocaleString()} (
                      {item.percent}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
