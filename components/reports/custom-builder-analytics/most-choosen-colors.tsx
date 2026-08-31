"use client";

import { useTranslations } from "next-intl";
import { ColorItem } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

// type MostChosenColorsProps = {
//   colors: ColorItem[];
// };

const colorMap: Record<string, string> = {
  red: "#ef7c74",
  white: "#f3f0e8",
  pink: "#e7a9b0",
  yellow: "#d7bd72",
  green: "#7f967b",
  orange: "#e6a16f",
  purple: "#9b86a8",
  blue: "#7f98b5",
};

function formatColorName(color: string | null) {
  if (!color) {
    return null;
  }

  return color
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function MostChosenColors({ colors }: { colors: ColorItem[] }) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");

  const data = [...colors]
    .map((item) => ({
      color: item.color,
      label: formatColorName(item.color) ?? t("UnspecifiedColor"),
      stems: Number(item.stems),
      share_pct: Number(item.share_pct),
      displayColor:
        item.color && colorMap[item.color] ? colorMap[item.color] : "#cfcfcf",
    }))
    .sort((a, b) => b.stems - a.stems);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("MostChosenColors")}
        </p>

        <div className="mt-5 space-y-4">
          {data.map((item, index) => (
            <div key={`${item.color ?? "null"}-${index}`}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 rounded-full border border-border"
                    style={{
                      backgroundColor: item.displayColor,
                    }}
                  />

                  <p className="text-sm font-medium text-foreground">
                    {item.label}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground tabular-nums">
                  {item.stems} ({item.share_pct}%)
                </p>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(item.share_pct, 100)}%`,
                    backgroundColor: item.displayColor,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
