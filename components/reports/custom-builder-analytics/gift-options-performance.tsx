"use client";

import { useTranslations } from "next-intl";
import { CreditCard, Ribbon } from "lucide-react";
import { GiftOptionsData } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

export default function GiftOptionsPerformance({
  giftOptions,
}: {
  giftOptions: GiftOptionsData;
}) {
  const t = useTranslations("Reports.CustomBuilderAnalytics");
  const tCommon = useTranslations("Common");

  const revenueTotal = Number(giftOptions.revenue_total);

  const options = [
    {
      key: "card_style",
      label: t("CardStyle"),
      icon: CreditCard,
      data: giftOptions.card_style,
    },
    {
      key: "ribbon",
      label: t("Ribbon"),
      icon: Ribbon,
      data: giftOptions.ribbon,
    },
  ];

  return (
    <Card className="h-full border border-primary/30 ring-0!">
      <CardContent>
        <header>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("GiftOptionsPerformance")}
          </p>

          <div className="mt-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-semibold text-foreground tabular-nums">
                {giftOptions.lines}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {t("GiftOptionLines")}
              </p>
            </div>

            <div className="text-end">
              <p className="text-sm font-semibold text-foreground tabular-nums">
                {tCommon("AED")} {revenueTotal.toLocaleString()}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {t("TotalRevenue")}
              </p>
            </div>
          </div>
        </header>

        <div className="mt-5 space-y-4">
          {options.map((option) => {
            const Icon = option.icon;

            const attachPct = Number(option.data.attach_pct);
            const revenue = Number(option.data.revenue);

            return (
              <div
                key={option.key}
                className="rounded-xl border border-border p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="grid size-8 place-content-center rounded-lg bg-primary/10">
                      <Icon className="size-4 text-primary" />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {option.label}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {option.data.lines} {t("Lines")}
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <p className="text-sm font-semibold tabular-nums">
                      {attachPct}%
                    </p>

                    <p className="text-[10px] text-muted-foreground">
                      {t("AttachRate")}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${Math.min(attachPct, 100)}%`,
                    }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t("Revenue")}</span>

                  <span className="font-medium tabular-nums">
                    {tCommon("AED")} {revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
