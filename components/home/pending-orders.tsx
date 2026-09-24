import { cn } from "@/lib/utils";
import { Today } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import TrendLineIcon from "../icons/trend-line-icon";
import { LoaderCircle, TrendingDown, TrendingUp } from "lucide-react";

export default async function PendingOrders({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");

  const percentageChange = today.processing_change
    ? ((today.processing_change - today.processing_orders_yesterday) /
        today.processing_orders_yesterday) *
      100
    : 0;

  return (
    <Card className="h-full ring-0! border border-primary/30">
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("ProcessingOrders")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              {today.processing_orders}
            </p>
          </div>
          <div className="w-9 h-9 bg-green-200/20 rounded-md grid place-content-center">
            <LoaderCircle className="size-4 text-green-500 animate-spin" />
          </div>
        </header>

        <div className="flex items-center gap-2 mt-1">
          <span>
            {t("Today")}:{" "}
            <span className="font-semibold text-primary">
              {today.processing_change}
            </span>
          </span>
          <span>
            {t("Yesterday")}:{" "}
            <span className="font-semibold text-primary">
              {today.processing_orders_yesterday}
            </span>
          </span>
        </div>

        {percentageChange !== 0 ? (
          <section className="flex items-center justify-between gap-4 mt-2">
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                +percentageChange > 0 ? "text-green-500" : "text-red-500",
              )}
            >
              {+percentageChange > 0 ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}{" "}
              {percentageChange.toFixed(2)}%{t("VsYesterday")}
            </p>
            <TrendLineIcon color="var(--primary)" />
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}
