import { cn } from "@/lib/utils";
import { TopCombo } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";

export default async function TopCustomBuilderCombos({
  topCombos,
}: {
  topCombos: TopCombo[];
}) {
  const t = await getTranslations("Dashboard");

  const flowers = topCombos.flatMap((combo) =>
    combo.flowers.map((flower) => ({
      ...flower,
      orders: combo.orders,
    })),
  );

  return (
    <Card className="p-0 h-full ring-0! border border-primary/30">
      <CardContent className="p-0">
        <div className="p-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            {t("TopCustomBuilderCombos")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("MostPickedFlowerCombinations")}
          </p>
        </div>

        {flowers.map((flower, index) => (
          <div
            key={index}
            className={cn("p-4", {
              "border-b border-border": index !== flowers.length - 1,
            })}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 text-xs grid place-content-center rounded-full bg-primary text-white">
                  {index + 1}
                </div>
                <p className="font-semibold">{flower.name}</p>
              </div>

              <div className="text-xs text-muted-foreground">
                {flower.orders} {t("Orders")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
