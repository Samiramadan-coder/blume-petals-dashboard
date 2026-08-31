"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Store, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { ByFulfillment } from "@/types/reports";

export default function RevenueByDeliveryMethod({
  revenueByFulfillment,
}: {
  revenueByFulfillment: ByFulfillment[];
}) {
  const t = useTranslations("Reports.SalesRevenue");
  const tCommon = useTranslations("Common");

  const data = revenueByFulfillment.map((item) => ({
    method: item.method,
    orders: Number(item.orders),
    revenue: Number(item.revenue),
    shipping: Number(item.shipping),
    average: Number(item.average),
    share_pct: Number(item.share_pct),
  }));

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalAverage = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  function getMethodName(method: string) {
    if (method === "delivery") {
      return t("Delivery");
    }

    if (method === "pickup") {
      return t("Pickup");
    }

    return method;
  }

  function getMethodIcon(method: string) {
    if (method === "delivery") {
      return (
        <div className="grid size-8 place-content-center rounded-lg bg-primary/10">
          <Truck className="size-4 text-primary" />
        </div>
      );
    }

    return (
      <div className="grid size-8 place-content-center rounded-lg bg-green-500/10">
        <Store className="size-4 text-green-700" />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="px-6 py-4">
        <p className="text-sm font-semibold text-foreground">
          {t("RevenueByDeliveryMethod")}
        </p>

        <p className="text-xs text-muted-foreground">
          {t("DeliveryMethodDescription")}
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="px-6 text-xs uppercase">
              {t("Method")}
            </TableHead>

            <TableHead className="text-xs uppercase">
              {t("Revenue")} ({tCommon("AED")})
            </TableHead>

            <TableHead className="text-xs uppercase">{t("Orders")}</TableHead>

            <TableHead className="text-xs uppercase">{t("AvgAov")}</TableHead>

            <TableHead className="text-xs uppercase">{t("Shipping")}</TableHead>

            <TableHead className="min-w-50 text-xs uppercase">
              {t("RevenueShare")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.method} className="h-16">
              <TableCell className="px-6">
                <div className="flex items-center gap-3">
                  {getMethodIcon(item.method)}
                  <span className="text-sm font-semibold text-foreground">
                    {getMethodName(item.method)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="text-sm font-semibold tabular-nums">
                {tCommon("AED")} {item.revenue.toLocaleString()}
              </TableCell>

              <TableCell className="text-sm tabular-nums">
                {item.orders}
              </TableCell>

              <TableCell className="text-sm tabular-nums">
                {tCommon("AED")}{" "}
                {item.average.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell className="text-sm">
                {tCommon("AED")}{" "}
                {item.shipping.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className={
                        item.method === "delivery"
                          ? "h-full rounded-full bg-primary"
                          : "h-full rounded-full bg-green-700/70"
                      }
                      style={{
                        width: `${Math.min(item.share_pct, 100)}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-muted-foreground tabular-nums">
                    {item.share_pct}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow className="bg-transparent hover:bg-transparent">
            <TableCell className="px-6 text-xs font-semibold uppercase text-muted-foreground">
              {t("Total")}
            </TableCell>

            <TableCell className="font-semibold">
              {tCommon("AED")} {totalRevenue.toLocaleString()}
            </TableCell>

            <TableCell className="font-semibold">{totalOrders}</TableCell>

            <TableCell className="text-muted-foreground">
              {tCommon("AED")}{" "}
              {totalAverage.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </TableCell>

            <TableCell />

            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
