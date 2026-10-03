import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { LowStock } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function LockStock({
  lowStock,
}: {
  lowStock: LowStock[];
}) {
  const t = await getTranslations("Dashboard");

  return (
    <Card className="p-0 h-full ring-0! border border-primary/30">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-400" />
            <p className="text-sm font-semibold text-foreground">
              {t("LowStockAlerts")}
            </p>
          </div>

          <Badge variant="destructive" className="h-7 shrink-0">
            {lowStock.length} {t("Items")}
          </Badge>
        </div>

        {lowStock.length === 0 && (
          <p className="p-6 text-center text-sm text-muted-foreground">
            {t("NoLowStock")}
          </p>
        )}

        {lowStock.map((stock, index) => (
          <div
            key={stock.variant_id ?? index}
            className={cn("flex items-center justify-between gap-4 p-4", {
              "border-b border-border": index !== lowStock.length - 1,
            })}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(`w-2 h-2 rounded-full`, {
                  "bg-red-400": stock.left <= stock.threshold,
                  "bg-primary": stock.left > stock.threshold,
                })}
              />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {stock.name}
                </p>
                <p className="text-xs text-muted-foreground">{stock.kind}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="text-[#8a6f2a] bg-primary/10 text-xs font-semibold"
              >
                <Link href={`/flowers?q=${encodeURIComponent(stock.name)}`}>
                  <RotateCcw /> {t("Restock")}
                </Link>
              </Button>

              <p
                className={cn(
                  "text-sm font-semibold tabular-nums whitespace-nowrap",
                  {
                    "text-red-400": stock.left <= stock.threshold,
                    "text-primary": stock.left > stock.threshold,
                  },
                )}
              >
                {stock.left} {t("Left")}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
