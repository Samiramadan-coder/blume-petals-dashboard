import { Summary } from "@/types/customers";
import { Card, CardContent } from "../ui/card";
import { UsersRound, Star, TrendingUp, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Statistics({ summary }: { summary: Summary }) {
  const t = useTranslations("Customers.Stats");

  const statisticsData = [
    {
      title: t("TotalCustomers"),
      value: summary.total_customers,
      icon: (
        <div className="p-2 bg-secondary/20 rounded-sm">
          <UsersRound className="text-secondary size-5" />
        </div>
      ),
    },
    {
      title: t("VipCustomers"),
      subtitle: t("VipSpent"),
      value: summary.vip,
      icon: (
        <div className="p-2 bg-primary/20 rounded-sm">
          <Star className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: t("NewThisMonth"),
      value: summary.new_this_month,
      icon: (
        <div className="p-2 bg-red-300/20 rounded-sm">
          <TrendingUp className="text-red-300 size-5" />
        </div>
      ),
    },
    {
      title: t("AverageLifetimeValue"),
      value: summary.avg_lifetime_value,
      currency: "AED",
      icon: (
        <div className="p-2 bg-foreground/20 rounded-sm">
          <ShoppingBag className="text-foreground size-5" />
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
            {stat.icon}

            <div>
              <p className="text-muted-foreground text-xs uppercase">
                {stat.title}
              </p>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {stat.currency && <span>{stat.currency}</span>} {stat.value}
              </p>
              {stat.subtitle && (
                <p className="text-[10px] text-muted-foreground">
                  {stat.subtitle}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
