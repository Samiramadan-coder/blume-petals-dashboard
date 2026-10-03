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

        {topCombos.map((combo, index) => (
          <div
            key={index}
            className={cn("p-4", {
              "border-b border-border": index !== topCombos.length - 1,
            })}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 items-start gap-2">
                <div className="w-5 h-5 shrink-0 text-xs grid place-content-center rounded-full bg-primary text-white">
                  {index + 1}
                </div>
                <p className="font-semibold wrap-break-word">
                  {(combo.flowers ?? [])
                    .map((flower) => flower.name)
                    .join(" + ")}
                </p>
              </div>

              <div className="shrink-0 text-xs text-muted-foreground">
                {combo.orders} {t("Orders")}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
