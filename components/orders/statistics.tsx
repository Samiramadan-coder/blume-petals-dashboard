import {
  Clock,
  Truck,
  Clipboard,
  DollarSign,
  LoaderCircle,
} from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { StatisticsData, Summary } from "@/types/orders";

export default function Statistics({ summary }: { summary: Summary }) {
  const statisticsData: StatisticsData[] = [
    {
      title: "Total Orders",
      subtitle: "All time in view",
      value: summary.total,
      icon: (
        <div className="p-1 bg-primary/20 rounded-sm">
          <Clipboard className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: "Pending",
      subtitle: "Awaiting action",
      value: summary.pending,
      icon: (
        <div className="p-1 bg-red-300/20 rounded-sm">
          <Clock className="text-red-300 size-5" />
        </div>
      ),
    },
    {
      title: "Processing",
      subtitle: "Being prepared",
      value: summary.processing,
      icon: (
        <div className="p-1 bg-primary/20 rounded-sm">
          <LoaderCircle className="text-primary size-5" />
        </div>
      ),
    },
    {
      title: "Shipped",
      subtitle: "Out for delivery",
      value: summary.shipped,
      icon: (
        <div className="p-1 bg-secondary/20 rounded-sm">
          <Truck className="text-secondary size-5" />
        </div>
      ),
    },
    {
      title: "Revenue",
      subtitle: "Excl. cancelled",
      value: parseFloat(summary.revenue),
      currency: "AED",
      icon: (
        <div className="p-1 bg-primary/20 rounded-sm">
          <DollarSign className="text-primary size-5" />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              {stat.currency && <span>{stat.currency}</span>} {stat.value}
            </p>
            <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
