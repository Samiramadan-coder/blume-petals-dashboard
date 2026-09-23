import { LoaderCircle } from "lucide-react";
import { Today } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

export default async function PendingOrders({ today }: { today: Today }) {
  const t = await getTranslations("Dashboard");

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
      </CardContent>
    </Card>
  );
}
