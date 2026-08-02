import { Clock, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";

export default function Statistics() {
  const t = useTranslations("Reviews");

  const statisticsData = [
    {
      title: t("TotalReviews"),
      value: 10,
      icon: (
        <div className="p-1 bg-primary/20 rounded-sm">
          <Star className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: t("AverageRating"),
      value: 5,
      icon: (
        <div className="p-1 bg-secondary/20 rounded-sm">
          <Star className="text-secondary size-5" />
        </div>
      ),
    },
    {
      title: t("ThisMonth"),
      value: 20,
      icon: (
        <div className="p-1 bg-red-300/20 rounded-sm">
          <Clock className="text-red-300 size-5" />
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
