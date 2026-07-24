import { Tag, TrendingUp, Clock3, CircleX } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useTranslations } from "next-intl";
import { PromoCodesSummary } from "@/types/promo-codes";

export default function Summary({ summary }: { summary: PromoCodesSummary }) {
  const t = useTranslations("PromoCodes");

  const statisticsData = [
    {
      title: t("Active"),
      value: summary.active,
      icon: (
        <div className="p-3 bg-primary/20 rounded-xl">
          <Tag className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: t("TotalRedemptions"),
      value: summary.total_redemptions,
      icon: (
        <div className="p-3 bg-secondary/20 rounded-xl">
          <TrendingUp className="text-secondary size-5" />
        </div>
      ),
    },
    {
      title: t("Scheduled"),
      value: summary.scheduled,
      icon: (
        <div className="p-3 bg-primary/20 rounded-xl">
          <Clock3 className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: t("ExpiredInactive"),
      value: summary.expired_inactive,
      icon: (
        <div className="p-3 bg-red-300/20 rounded-xl">
          <CircleX className="text-red-300 size-5" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statisticsData.map((stat, index) => (
        <Card
          key={index}
          className="border border-primary/20"
          style={{ boxShadow: "none" }}
        >
          <CardContent className="flex items-center gap-4">
            <div>{stat.icon}</div>
            <div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
