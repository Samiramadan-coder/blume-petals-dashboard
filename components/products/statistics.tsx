import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";

export default function Statistics() {
  const t = useTranslations("Products");

  const statisticsData = [
    {
      title: t("Stats.TotalProducts"),
      value: 12,
      color: "bg-primary/10",
      borderColor: "border-primary/20",
      textColor: "text-[#8A6F2A]",
    },
    {
      title: t("Stats.InStock"),
      value: 7,
      color: "bg-secondary/10",
      borderColor: "border-secondary/20",
      textColor: "text-secondary",
    },
    {
      title: t("Stats.LowStock"),
      value: 4,
      color: "bg-primary/10",
      borderColor: "border-primary/20",
      textColor: "text-[#8A6F2A]",
    },
    {
      title: t("Stats.OutOfStock"),
      value: 1,
      color: "bg-[#ed80741a]",
      borderColor: "border-red/20",
      textColor: "text-[#B83A30]",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((stat, index) => (
        <Card
          key={index}
          className={`${stat.color} border ${stat.borderColor}`}
          style={{ boxShadow: "none" }}
        >
          <CardContent>
            <p
              className={`text-xs font-medium uppercase tracking-wide ${stat.textColor} mb-2`}
            >
              {stat.title}
            </p>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
