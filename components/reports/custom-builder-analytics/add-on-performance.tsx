"use client";

import { PackagePlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { AddonsData } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

export default function AddonsPerformance({ addons }: { addons: AddonsData }) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");
  const tCommon = useTranslations("Common");

  const attachPct = Number(addons.attach_pct);
  const revenue = Number(addons.revenue);

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {t("AddonsPerformance")}
            </p>

            <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
              {attachPct}%
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {t("AddonAttachRate")}
            </p>
          </div>

          <div className="grid size-9 place-content-center rounded-lg bg-primary/10">
            <PackagePlus className="size-4 text-primary" />
          </div>
        </header>

        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{
                width: `${Math.min(attachPct, 100)}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {addons.with_addon} {t("Of")} {addons.orders} {t("OrdersWithAddon")}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-border">
          <div>
            <p className="text-[10px] uppercase text-muted-foreground">
              {t("Orders")}
            </p>

            <p className="mt-1 text-sm font-semibold tabular-nums">
              {addons.orders}
            </p>
          </div>

          <div className="px-4">
            <p className="text-[10px] uppercase text-muted-foreground">
              {t("WithAddon")}
            </p>

            <p className="mt-1 text-sm font-semibold tabular-nums">
              {addons.with_addon}
            </p>
          </div>

          <div className="ps-4">
            <p className="text-[10px] uppercase text-muted-foreground">
              {t("AddonRevenue")}
            </p>

            <p className="mt-1 text-sm font-semibold tabular-nums">
              {tCommon("AED")} {revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
