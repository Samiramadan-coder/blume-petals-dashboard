import { Badge } from "../ui/badge";
import { Clock } from "lucide-react";
import { Today } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import TrendLineIcon from "../icons/trend-line-icon";

export default async function PendingOrders({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");

  return (
    <Card className="h-full ring-0! border border-primary/30">
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("PendingOrders")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              {today.pending_orders}
            </p>
          </div>
          <div className="w-9 h-9 bg-red-500/20 rounded-md grid place-content-center">
            <Clock className="size-4 text-red-500" />
          </div>
        </header>

        <section className="flex items-center justify-between gap-4 mt-5">
          <Badge className="h-7 w-30" variant="destructive">
            {t("NeedsAttention")}
          </Badge>

          <TrendLineIcon color="var(--color-red-500)" />
        </section>
      </CardContent>
    </Card>
  );
}
