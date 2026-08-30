import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { Order } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { ArrowRight, TabletSmartphone, GlobeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { statusColorClasses } from "@/constants/orders";

export default async function RecentOrders({
  recentOrders,
}: {
  recentOrders: Order[];
}) {
  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");

  return (
    <Card className="p-0 h-full">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
          <p className="text-sm font-semibold text-foreground">
            {t("RecentOrders")}
          </p>

          <Link href="/orders">
            <Button
              variant="ghost"
              className="text-xs hover:bg-transparent hover:text-primary text-primary"
            >
              {t("ViewAll")}
              <ArrowRight />
            </Button>
          </Link>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="ps-6 text-muted-foreground uppercase text-xs">
                Order
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Customer
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Items
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Total
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                Status
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                CH
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recentOrders.map((order, index) => (
              <TableRow key={index}>
                <TableCell className="py-4 ps-6 text-xs">
                  {order.order_number}
                </TableCell>
                <TableCell className="text-sm">{order.customer}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {order.items.map((item, idx) => (
                    <p key={idx}>
                      {item.name} × {item.qty}
                    </p>
                  ))}
                </TableCell>
                <TableCell className="text-sm">
                  {tCommon("AED")} {order.total}
                </TableCell>
                <TableCell className="text-sm">
                  <Badge
                    className={cn(
                      "capitalize h-6",
                      statusColorClasses[order.status],
                    )}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {order.channel === "website" ? (
                    <GlobeCheck className="size-4 text-muted-foreground" />
                  ) : (
                    <TabletSmartphone className="size-4 text-muted-foreground" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
