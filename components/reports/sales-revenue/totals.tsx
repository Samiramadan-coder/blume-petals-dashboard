import {
  RotateCcw,
  TrendingUp,
  CreditCard,
  PackageCheck,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TotalType } from "@/types/reports";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import TrendLineIcon from "@/components/icons/trend-line-icon";

export default async function Totals({ totals }: { totals: TotalType }) {
  const tCommon = await getTranslations("Common");
  const t = await getTranslations("Reports.SalesRevenue");

  return (
    <>
      {/* Total Revenue Card */}
      <Card className="h-full ring-0! border border-primary/30">
        <CardContent>
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("TotalRevenue")}
              </p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
                {tCommon("AED")} {totals.revenue}
              </p>
            </div>
            <div className="w-9 h-9 bg-primary/20 rounded-md grid place-content-center">
              <TrendingUp className="size-4 text-primary" />
            </div>
          </header>

          {totals.revenue_change_pct && +totals.revenue_change_pct !== 0 && (
            <section className="flex items-center justify-between gap-4 mt-5">
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  +totals.revenue_change_pct > 0
                    ? "text-green-500"
                    : "text-red-500",
                )}
              >
                {+totals.revenue_change_pct > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}{" "}
                {totals.revenue_change_pct}%{t("VsPrevPeriod")}
              </p>
              <TrendLineIcon color="var(--primary)" />
            </section>
          )}
        </CardContent>
      </Card>

      {/* Total Orders Card */}
      <Card className="h-full ring-0! border border-primary/30">
        <CardContent>
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("TotalOrders")}
              </p>
              <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
                {totals.orders}
              </p>
            </div>

            <div className="w-9 h-9 bg-secondary/20 rounded-md grid place-content-center">
              <PackageCheck className="size-4 text-secondary" />
            </div>
          </header>

          {totals.orders_change_pct && +totals.orders_change_pct !== 0 && (
            <section className="flex items-center justify-between gap-4 mt-5">
              <p
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  +totals.orders_change_pct > 0
                    ? "text-green-500"
                    : "text-red-500",
                )}
              >
                {+totals.orders_change_pct > 0 ? (
                  <TrendingUp className="size-4" />
                ) : (
                  <TrendingDown className="size-4" />
                )}{" "}
                {+totals.orders_change_pct > 0 && "+"}
                {totals.orders_change_pct}% {t("VsPrevPeriod")}
              </p>

              <TrendLineIcon color="var(--primary)" />
            </section>
          )}
        </CardContent>
      </Card>

      {/* Average Order Value Card */}
      <Card className="h-full ring-0! border border-primary/30">
        <CardContent>
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("AvgOrderValue")}
              </p>

              <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
                {tCommon("AED")} {totals.average_order}
              </p>
            </div>

            <div className="w-9 h-9 bg-primary/20 rounded-md grid place-content-center">
              <CreditCard className="size-4 text-primary" />
            </div>
          </header>

          {totals.average_order_change_pct &&
            +totals.average_order_change_pct !== 0 && (
              <section className="flex items-center justify-between gap-4 mt-5">
                <p
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    +totals.average_order_change_pct > 0
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  {+totals.average_order_change_pct > 0 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  {totals.average_order_change_pct}% {t("VsPrevPeriod")}
                </p>

                <TrendLineIcon color="var(--primary)" />
              </section>
            )}
        </CardContent>
      </Card>

      {/* Refunds / Cancellations Card */}
      <Card className="h-full ring-0! border border-primary/30">
        <CardContent>
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {t("RefundsCancellations")}
              </p>

              <p className="mt-1.5 text-2xl font-semibold text-red-400 tabular-nums">
                {tCommon("AED")} {totals.returning_revenue}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {totals.orders} {t("Orders")}
              </p>
            </div>

            <div className="w-9 h-9 bg-red-500/10 rounded-md grid place-content-center">
              <RotateCcw className="size-4 text-red-400" />
            </div>
          </header>

          {totals.returning_revenue_change_pct &&
            +totals.returning_revenue_change_pct !== 0 && (
              <section className="flex items-center justify-between gap-4 mt-5">
                <p
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    +totals.returning_revenue_change_pct > 0
                      ? "text-red-400"
                      : "text-green-500",
                  )}
                >
                  {+totals.returning_revenue_change_pct > 0 ? (
                    <TrendingUp className="size-4" />
                  ) : (
                    <TrendingDown className="size-4" />
                  )}
                  {totals.returning_revenue_change_pct}% {t("VsPrevPeriod")}
                </p>

                <TrendLineIcon color="#fb7185" />
              </section>
            )}
        </CardContent>
      </Card>
    </>
  );
}
