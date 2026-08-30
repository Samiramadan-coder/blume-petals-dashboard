import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { AlertTriangle } from "lucide-react";
import { LowStock } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

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

          <Badge variant="destructive" className="h-7 w-15">
            {lowStock.length} {t("Items")}
          </Badge>
        </div>

        {lowStock.map((stock, index) => (
          <div
            key={index}
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
              <p
                className={cn("text-sm font-semibold tabular-nums", {
                  "text-red-400": stock.left <= stock.threshold,
                  "text-primary": stock.left > stock.threshold,
                })}
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
