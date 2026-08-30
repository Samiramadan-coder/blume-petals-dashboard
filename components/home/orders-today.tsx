import { ShoppingBag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import TrendLineIcon from "../icons/trend-line-icon";
import { Today } from "@/types/dashboard";
import { getTranslations } from "next-intl/server";

export default async function OrdersToday({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");
  return (
    <Card className="h-full">
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("OrdersToday")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              {today.orders}
            </p>
          </div>
          <div className="w-9 h-9 bg-secondary/20 rounded-md grid place-content-center">
            <ShoppingBag className="size-4 text-secondary" />
          </div>
        </header>

        {today.orders_change ? (
          <section className="flex items-center justify-between gap-4 mt-5">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <TrendingUp className="size-4" /> +{today.orders_change}%{" "}
              {t("VsYesterday")}
            </p>
            <TrendLineIcon color="var(--secondary)" />
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}
