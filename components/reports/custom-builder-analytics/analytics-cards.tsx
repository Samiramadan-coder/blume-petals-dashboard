"use client";

import { Funnel } from "@/types/reports";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";

export default function AnalyticsCards({ funnel }: { funnel: Funnel }) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");

  const built = Number(funnel.built);
  const purchased = Number(funnel.purchased);
  const dropped = Number(funnel.dropped);
  const conversion = Number(funnel.conversion_pct);

  return (
    <>
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("CustomBuildsStarted")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {built.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("BuilderSessionsInitiated")}
          </p>
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("CustomBuildsPurchased")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {purchased.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("CompletedPurchase")}
          </p>
          <div className="mt-3 inline-flex rounded-md bg-[#7f967b]/10 px-2.5 py-1 text-[10px] font-medium text-foreground">
            {conversion}% {t("OfSessions")}
          </div>
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("ConversionRate")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {conversion}%
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("BuildToPurchaseConversion")}
          </p>
          <div className="mt-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-foreground">
            {t("Target")} &gt; 50%
          </div>
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("DroppedBuilds")}
          </p>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {dropped.toLocaleString()}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {t("BuildsNotPurchased")}
          </p>
          <div className="mt-3 inline-flex rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-foreground">
            {built > 0 ? `${((dropped / built) * 100).toFixed(1)}%` : "0%"}{" "}
            {t("OfSessions")}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
