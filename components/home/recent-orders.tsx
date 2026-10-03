import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Link } from "@/i18n/navigation";
import { Order } from "@/types/dashboard";
import { Card, CardContent } from "../ui/card";
import { getTranslations } from "next-intl/server";
import { orderStatuses, statusColorClasses } from "@/constants/orders";
import { ArrowRight, TabletSmartphone, GlobeCheck } from "lucide-react";

export default async function RecentOrders({
  recentOrders,
}: {
  recentOrders: Order[];
}) {
  const t = await getTranslations("Dashboard");
  const tCommon = await getTranslations("Common");
  const tOrders = await getTranslations("Orders");
  const statuses = orderStatuses((key) => tOrders(key as never));

  return (
    <Card className="p-0 h-full ring-0! border border-primary/30">
      <CardContent className="p-0">
        <div className="flex items-center justify-between gap-4 p-4 border-b border-primary/30">
          <p className="text-sm font-semibold text-foreground">
            {t("RecentOrders")}
          </p>

          <Button
            asChild
            variant="ghost"
            className="text-xs hover:bg-transparent hover:text-primary text-primary"
          >
            <Link href="/orders">
              {t("ViewAll")}
              <ArrowRight className="rtl:rotate-180" />
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="border-primary/30">
              <TableHead className="ps-6 text-muted-foreground uppercase text-xs">
                {tOrders("Table.OrderID")}
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                {tOrders("Table.CustomerName")}
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                {tOrders("Table.ItemsCount")}
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                {tOrders("Table.TotalAmount")}
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                {tOrders("Table.Status")}
              </TableHead>
              <TableHead className="text-muted-foreground uppercase text-xs">
                {tOrders("Table.Channel")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {recentOrders.length === 0 && (
              <TableRow className="border-primary/30">
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  {tOrders("NoOrders")}
                </TableCell>
              </TableRow>
            )}

            {recentOrders.map((order) => (
              <TableRow key={order.id} className="border-primary/30">
                <TableCell className="py-4 ps-6 text-xs">
                  {order.order_number}
                </TableCell>
                <TableCell className="text-sm">{order.customer}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {(order.items ?? []).map((item, idx) => (
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
                    {statuses.find((status) => status.value === order.status)
                      ?.label ?? order.status}
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
