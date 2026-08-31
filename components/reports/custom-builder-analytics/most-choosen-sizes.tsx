"use client";

import {
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  PieSectorShapeProps,
} from "recharts";
import { SizeItem } from "@/types/reports";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

type ChartItem = {
  size: string;
  designs: number;
  percent: number;
  color: string;
};

const colors = ["#cfb77b", "#a68d50", "#7f967b", "#ef7c74"];

function DonutSlice(props: PieSectorShapeProps) {
  const item = props.payload as ChartItem;
  return (
    <Sector {...props} fill={item.color} stroke="#ffffff" strokeWidth={2} />
  );
}

export default function MostChosenSize({ sizes }: { sizes: SizeItem[] }) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");

  const data: ChartItem[] = [...sizes]
    .map((item, index) => ({
      size: item.size,
      designs: Number(item.designs),
      percent: Number(item.share_pct),
      color: colors[index % colors.length],
    }))
    .sort((a, b) => b.designs - a.designs);

  const topSize = data[0];

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("MostChosenSize")}
        </p>

        <div className="mt-4 grid grid-cols-[110px_1fr] items-center gap-4">
          <div className="relative h-27.5 w-27.5">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="designs"
                  nameKey="size"
                  cx="50%"
                  cy="50%"
                  innerRadius={34}
                  outerRadius={53}
                  startAngle={90}
                  endAngle={-270}
                  stroke="#ffffff"
                  strokeWidth={2}
                  shape={DonutSlice}
                />
              </PieChart>
            </ResponsiveContainer>

            {topSize && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-base font-semibold text-primary">
                    {topSize.size}
                  </p>

                  <p className="mt-0.5 text-[9px] text-muted-foreground">
                    {t("Top")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.size}
                className="flex items-center justify-between gap-6"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full"
                    style={{
                      backgroundColor: item.color,
                    }}
                  />

                  <span className="text-sm font-medium text-foreground">
                    {item.size}
                  </span>
                </div>

                <span className="text-xs text-muted-foreground tabular-nums">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
