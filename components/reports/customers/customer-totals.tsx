"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUp } from "lucide-react";
import { CustomerTotalType } from "@/types/reports";
import { Card, CardContent } from "@/components/ui/card";

export default function CustomerTotals({
  totals,
}: {
  totals: CustomerTotalType;
}) {
  const t = useTranslations("Reports.CustomerStats");
  const tCommon = useTranslations("Common");

  return (
    <>
      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("TotalCustomers")}
          </p>
          <p className="mt-3 text-2xl font-semibold text-foreground tabular-nums">
            {totals.active_customers + totals.new_customers}
          </p>
          <ChangePercent value={totals.active_customers_change_pct} />
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("NewCustomers")}
          </p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {totals.new_customers}
            </p>
            <span className="text-xs text-muted-foreground">
              {t("ThisPeriod")}
            </span>
          </div>
          <ChangePercent value={totals.new_customers_change_pct} />
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("RetentionRate")}
          </p>
          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {Number(totals.retention_pct)}
            </p>
            <span className="text-xs text-muted-foreground">%</span>
          </div>

          <ChangeFromPrevious
            current={totals.retention_pct}
            previous={totals.retention_pct_previous}
          />
        </CardContent>
      </Card>

      <Card className="h-full border border-primary/30 ring-0!">
        <CardContent>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t("AvgLifetimeValue")}
          </p>

          <div className="mt-3 flex items-baseline gap-1.5">
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {Number(totals.lifetime_value).toLocaleString()}
            </p>

            <span className="text-xs text-muted-foreground">
              {tCommon("AED")}
            </span>
          </div>

          {/* <MiniBars values={lifetimeBars} className="bg-[#a7b7a5]" /> */}

          <ChangePercent value={totals.revenue_change_pct} />
        </CardContent>
      </Card>
    </>
  );
}

// Component to display the percentage change with an arrow indicating direction
function ChangePercent({ value }: { value: string | null }) {
  if (value === null) {
    return (
      <div className="mt-3 text-xs font-medium text-muted-foreground">—</div>
    );
  }

  const change = Number(value);
  const positive = change >= 0;

  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-1 text-xs font-medium",
        positive ? "text-green-600" : "text-red-500",
      )}
    >
      {positive ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ArrowDown className="size-3.5" />
      )}

      <span>{Math.abs(change)}%</span>
    </div>
  );
}

// Component to display the change from the previous value with an arrow indicating direction
function ChangeFromPrevious({
  current,
  previous,
}: {
  current: string;
  previous: string;
}) {
  const currentValue = Number(current);
  const previousValue = Number(previous);

  if (!previousValue) {
    return (
      <div className="mt-3 text-xs font-medium text-muted-foreground">—</div>
    );
  }

  const diff = ((currentValue - previousValue) / previousValue) * 100;
  const positive = diff >= 0;

  return (
    <div
      className={cn(
        "mt-3 flex items-center gap-1 text-xs font-medium",
        positive ? "text-green-600" : "text-red-500",
      )}
    >
      {positive ? (
        <ArrowUp className="size-3.5" />
      ) : (
        <ArrowDown className="size-3.5" />
      )}

      <span>{Math.abs(diff).toFixed(0)}%</span>
    </div>
  );
}
