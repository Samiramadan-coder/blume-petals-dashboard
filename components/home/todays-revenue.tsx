import { TrendingDown, TrendingUp } from "lucide-react";
import { Today } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import TrendLineIcon from "../icons/trend-line-icon";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

export default async function TodaysRevenue({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");

  return (
    <Card className="h-full ring-0! border border-primary/30">
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("TodaysRevenue")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              {tCommon("AED")} {today.revenue}
            </p>
          </div>
          <div className="w-9 h-9 bg-primary/20 rounded-md grid place-content-center">
            <TrendingUp className="size-4 text-primary" />
          </div>
        </header>

        {today.revenue_change_pct && +today.revenue_change_pct !== 0 && (
          <section className="flex items-center justify-between gap-4 mt-5">
            <p
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                +today.revenue_change_pct > 0
                  ? "text-green-500"
                  : "text-red-500",
              )}
            >
              {+today.revenue_change_pct > 0 ? (
                <TrendingUp className="size-4" />
              ) : (
                <TrendingDown className="size-4" />
              )}{" "}
              {today.revenue_change_pct}%{t("VsYesterday")}
            </p>
            <TrendLineIcon color="var(--primary)" />
          </section>
        )}
      </CardContent>
    </Card>
  );
}
