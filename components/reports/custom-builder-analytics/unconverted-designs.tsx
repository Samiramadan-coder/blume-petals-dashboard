"use client";

import { useTranslations } from "next-intl";
import { CircleDollarSign } from "lucide-react";
import { UnconvertedData } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

export default function UnconvertedDesigns({
  unconverted,
}: {
  unconverted: UnconvertedData;
}) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");
  const tCommon = useTranslations("Common");

  const potentialValue = Number(unconverted.potential_value);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("UnconvertedDesigns")}
            </p>

            <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
              {unconverted.designs}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("DesignsNotConverted")}
            </p>
          </div>

          <div className="grid size-9 place-content-center rounded-lg bg-primary/10">
            <CircleDollarSign className="size-4 text-primary" />
          </div>
        </header>

        <div className="mt-5 rounded-lg bg-muted/40 p-3">
          <p className="text-[10px] font-medium uppercase text-muted-foreground">
            {t("PotentialValue")}
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground tabular-nums">
            {tCommon("AED")} {potentialValue.toLocaleString()}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted-foreground">
            {t("UnbuildableDesigns")}
          </span>

          <span className="text-sm font-semibold tabular-nums">
            {unconverted.unbuildable}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
