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
import { CustomerByChannel } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

type ChartItem = {
  channel: "website" | "mobile_app";
  label: string;
  customers: number;
  percent: number;
  color: string;
};

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as ChartItem;
  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={3} />
  );
}

export default function NewCustomerAcquisitionChannel({
  byChannel,
}: {
  byChannel: CustomerByChannel[];
}) {
  const t = useTranslations("Reports.CustomerStats");
  const website = byChannel.find((item) => item.channel === "website");
  const mobileApp = byChannel.find((item) => item.channel === "mobile_app");

  const data: ChartItem[] = [
    {
      channel: "mobile_app",
      label: t("MobileApp"),
      customers: Number(mobileApp?.customers ?? 0),
      percent: Number(mobileApp?.share_pct ?? 0),
      color: "#cbb682",
    },
    {
      channel: "website",
      label: t("Website"),
      customers: Number(website?.customers ?? 0),
      percent: Number(website?.share_pct ?? 0),
      color: "#7f967b",
    },
  ];

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("NewCustomerAcquisitionChannel")}
        </p>

        <div className="mt-7 grid grid-cols-[260px_1fr] items-center gap-8">
          <div className="h-50 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="customers"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
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
                      <div className="min-w-36 rounded-lg border border-primary/20 bg-background p-3 shadow-md">
                        <p className="mb-2 text-sm font-semibold text-foreground">
                          {item.label}
                        </p>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Customers")}
                            </span>

                            <span className="font-medium text-foreground">
                              {item.customers}
                            </span>
                          </div>

                          <div className="flex items-center justify-between gap-5">
                            <span className="text-muted-foreground">
                              {t("Share")}
                            </span>

                            <span className="font-medium text-foreground">
                              {item.percent}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            {data.map((item) => (
              <div key={item.channel} className="flex items-start gap-3">
                <span
                  className="mt-1 size-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.label}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("CustomersCount", {
                      count: item.customers,
                    })}{" "}
                    ({item.percent}%)
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
