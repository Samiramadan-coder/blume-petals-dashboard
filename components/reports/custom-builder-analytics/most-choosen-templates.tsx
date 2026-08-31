"use client";

import { TemplateItem } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export default function MostChosenTemplate({
  templates,
}: {
  templates: TemplateItem[];
}) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");
  const locale = useLocale();

  const data = [...templates]
    .map((item) => ({
      ...item,
      designs: Number(item.designs),
      share_pct: Number(item.share_pct),
      name: locale === "ar" ? item.name_ar : item.name_en,
    }))
    .sort((a, b) => b.designs - a.designs);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("MostChosenTemplate")}
        </p>

        <div className="mt-5 space-y-4">
          {data.map((item) => (
            <div key={item.variant_id}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-foreground">
                  {item.name}
                </p>

                <p className="text-sm text-muted-foreground tabular-nums">
                  {item.designs} ({item.share_pct}%)
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
