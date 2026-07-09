import { UsersRound, Star, TrendingUp, ShoppingBag } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { StatisticsData } from "@/types/customers";

export default function Statistics() {
  const statisticsData: StatisticsData[] = [
    {
      title: "Total Customers",
      value: 10,
      icon: (
        <div className="p-2 bg-secondary/20 rounded-sm">
          <UsersRound className="text-secondary size-5" />
        </div>
      ),
    },
    {
      title: "VIP Customers",
      subtitle: "≥ AED 3,000 spent",
      value: 2,
      icon: (
        <div className="p-2 bg-primary/20 rounded-sm">
          <Star className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: "New This Month",
      value: 2,
      icon: (
        <div className="p-2 bg-red-300/20 rounded-sm">
          <TrendingUp className="text-red-300 size-5" />
        </div>
      ),
    },
    {
      title: "Avg. Lifetime Value",
      value: 4168,
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
