"use client";

import {
  Pie,
  Sector,
  PieChart,
  ResponsiveContainer,
  PieSectorShapeProps,
} from "recharts";
import { useTranslations } from "next-intl";
import { ByChannel } from "@/types/reports";
import { Globe, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type DonutChartItem = {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
  percent: number;
};

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as DonutChartItem;

  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={3} />
  );
}

export default function RevenueByChannel({
  revenueByChannel,
}: {
  revenueByChannel: ByChannel[];
}) {
  const t = useTranslations("Reports.SalesRevenue");
  const tCommon = useTranslations("Common");

  const totalRevenue = revenueByChannel.reduce(
    (sum, channel) => sum + Number(channel.revenue),
    0,
  );

  const data: DonutChartItem[] = [
    {
      label: "Mobile App",
      value: Number(
        revenueByChannel.find((c) => c.channel === "mobile_app")?.revenue ?? 0,
      ),
      color: "#cbb682",
      icon: <Smartphone size={12} />,
      percent: Number(
        revenueByChannel.find((c) => c.channel === "mobile_app")?.share_pct ??
          0,
      ),
    },
    {
      label: "Website",
      value: Number(
        revenueByChannel.find((c) => c.channel === "website")?.revenue ?? 0,
      ),
      color: "#7f967b",
      icon: <Globe size={12} />,
      percent: Number(
        revenueByChannel.find((c) => c.channel === "website")?.share_pct ?? 0,
      ),
    },
  ];

  return (
    <Card className="ring-0! border border-primary/30">
      <CardContent>
        <div>
          <p className="uppercase text-muted-foreground text-sm">
            {t("RevenueByChannel")}
          </p>

          <p className="font-semibold text-foreground">
            {tCommon("AED")} {totalRevenue}
          </p>
        </div>

        <div className="relative mt-4 h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={98}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="#ffffff"
                strokeWidth={3}
                shape={DonutSlice}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[10px] text-muted-foreground">
                {tCommon("AED")}
              </p>

              <p className="text-base font-semibold text-foreground tabular-nums">
                {totalRevenue}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />

                <span className="flex items-center gap-1 text-sm text-foreground">
                  <span className="text-muted-foreground">{item.icon}</span>

                  {item.label}
                </span>
              </div>

              <span className="text-xs font-semibold">
                {tCommon("AED")} {item.value}{" "}
                <span className="text-muted-foreground">{item.percent}%</span>
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
