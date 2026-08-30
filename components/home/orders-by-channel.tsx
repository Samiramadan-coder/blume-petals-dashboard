"use client";

import {
  Pie,
  Sector,
  PieChart,
  ResponsiveContainer,
  PieSectorShapeProps,
} from "recharts";
import { Card, CardContent } from "../ui/card";
import { Globe, Smartphone } from "lucide-react";
import { OrdersByChannelType } from "@/types/dashboard";
import { useTranslations } from "next-intl";

type DonutChartItem = {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
};

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as DonutChartItem;

  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={3} />
  );
}

export default function OrdersByChannel({
  ordersByChannel,
}: {
  ordersByChannel: OrdersByChannelType;
}) {
  const t = useTranslations("Dashboard");

  const data: DonutChartItem[] = [
    {
      label: "Mobile App",
      value: Number(
        ordersByChannel.channels.find((c) => c.channel === "mobile_app")
          ?.percent ?? 0,
      ),
      color: "#cbb682",
      icon: <Smartphone size={12} />,
    },
    {
      label: "Website",
      value: Number(
        ordersByChannel.channels.find((c) => c.channel === "website")
          ?.percent ?? 0,
      ),
      color: "#7f967b",
      icon: <Globe size={12} />,
    },
  ];

  return (
    <Card>
      <CardContent>
        <div>
          <p className="uppercase text-muted-foreground text-sm">
            {t("OrdersByChannel")}
          </p>
          <p className="font-semibold text-foreground">
            {ordersByChannel.total}
          </p>
          <p className="text-xs text-muted-foreground">{t("ThisMonth")}</p>
        </div>

        <div className="w-full h-45 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
                startAngle={90}
                endAngle={-270}
                stroke="#ffffff"
                strokeWidth={3}
                shape={DonutSlice}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-3">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="flex items-center gap-1 text-sm text-foreground">
                  {item.icon && (
                    <span className="text-muted-foreground">{item.icon}</span>
                  )}

                  {item.label}
                </span>
              </div>

              <span
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
