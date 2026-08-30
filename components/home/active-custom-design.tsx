import { Today } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { Palette, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import TrendLineIcon from "../icons/trend-line-icon";

export default async function ActiveCustomDesign({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");

  return (
    <Card>
      <CardContent>
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {t("ActiveCustomDesign")}
            </p>
            <p className="mt-1.5 text-2xl font-semibold text-foreground tabular-nums">
              {today.active_designs}
            </p>
          </div>
          <div className="w-9 h-9 bg-primary/20 rounded-md grid place-content-center">
            <Palette className="size-4 text-primary" />
          </div>
        </header>

        <section className="flex items-center justify-between gap-4 mt-5">
          <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <TrendingUp className="size-4" /> {t("SavedNotPurchased")}
          </p>

          <TrendLineIcon color="var(--primary)" />
        </section>
      </CardContent>
    </Card>
  );
}
