import { useTranslations } from "next-intl";
import { Card, CardContent } from "../../ui/card";
import { Flower2, TriangleAlert, CircleX } from "lucide-react";

export default function Statistics() {
  const t = useTranslations("Flower.Statistics");

  const statisticsData = [
    {
      title: t("TotalFlowers"),
      value: 10,
      icon: (
        <div className="p-2 bg-primary/20 rounded-sm">
          <Flower2 className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: t("LowStock"),
      value: 20,
      icon: (
        <div className="p-2 bg-[#ed807426] rounded-sm">
          <TriangleAlert className="text-[#b85a4e] size-5" />
        </div>
      ),
    },
    {
      title: t("OutOfStock"),
      value: 30,
      icon: (
        <div className="p-2 bg-[#dc26261a] rounded-sm">
          <CircleX className="text-[#dc2626] size-5" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statisticsData.map((stat, index) => (
        <Card
          key={index}
          className="border border-primary/20"
          style={{ boxShadow: "none" }}
        >
          <CardContent className="space-y-2">
            <header className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs uppercase">
                {stat.title}
              </p>
              {stat.icon}
            </header>
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
