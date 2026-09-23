import { CircleAlert, Clock, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "../ui/card";
import { Summary } from "@/types/reviews";
import { Badge } from "../ui/badge";

export default function Statistics({ summary }: { summary: Summary }) {
  const t = useTranslations("Reviews");

  const statisticsData = [
    {
      title: t("TotalReviews"),
      value: summary.total_reviews,
      icon: (
        <div className="p-2 bg-primary/20 rounded-sm">
          <Star className="text-primary size-4" />
        </div>
      ),
    },
    {
      title: t("AverageRating"),
      value: summary.average_rating,
      icon: (
        <div className="p-2 bg-secondary/20 rounded-sm">
          <Star className="text-secondary/50 size-4" />
        </div>
      ),
    },
    {
      title: t("ThisMonth"),
      value: summary.this_month,
      icon: (
        <div className="p-2 bg-red-300/20 rounded-sm">
          <Clock className="text-red-300 size-4" />
        </div>
      ),
    },
    {
      title: t("FlaggedReported"),
      value: summary.flagged,
      icon: (
        <div className="p-2 bg-red-300/20 rounded-sm">
          <CircleAlert className="text-red-300 size-4" />
        </div>
      ),
      badge: (
        <Badge className="text-red-600 bg-red-300/20">
          {t("ReviewedNeeded")}
        </Badge>
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
          <CardContent className="space-y-2">
            <header className="flex items-center justify-between gap-2">
              <p className="text-muted-foreground text-xs uppercase">
                {stat.title}
              </p>
              {stat.icon}
            </header>
            <p className="text-2xl font-bold tabular-nums text-foreground flex items-center gap-2">
              {stat.value}
              {stat.badge && stat.badge}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
