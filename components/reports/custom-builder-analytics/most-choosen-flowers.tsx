"use client";

import { FlowerItem } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

function formatColor(color: string | null) {
  if (!color) return "";

  return color
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function MostChosenFlowers({
  flowers,
}: {
  flowers: FlowerItem[];
}) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");
  const locale = useLocale();

  const data = [...flowers]
    .map((item) => {
      const baseName = locale === "ar" ? item.name_ar : item.name_en;
      const color = formatColor(item.color_slug);

      return {
        ...item,
        units: Number(item.units),
        share_pct: Number(item.share_pct),
        displayName: color ? `${baseName} - ${color}` : baseName,
      };
    })
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("MostChosenFlowers")}
        </p>

        <div className="mt-5 space-y-4">
          {data.map((item) => (
            <div key={item.variant_id}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">
                  {item.displayName}
                </p>

                <p className="text-sm text-muted-foreground tabular-nums">
                  {item.units} ({item.share_pct}%)
                </p>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(item.share_pct, 100)}%`,
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
