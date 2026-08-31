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
import { Card } from "@/components/ui/card";
import { ByEmirate } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";

export default function RevenueByEmirate({
  revenueByEmirate,
}: {
  revenueByEmirate: ByEmirate[];
}) {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const t = useTranslations("Reports.SalesRevenue");

  const data = revenueByEmirate
    .map((item) => ({
      city_id: item.city_id,
      name: locale === "ar" ? item.name_ar : item.name_en,
      orders: Number(item.orders),
      revenue: Number(item.revenue),
      share_pct: Number(item.share_pct),
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const totalOrders = data.reduce((sum, item) => sum + item.orders, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="px-6 py-4">
        <p className="text-sm font-semibold text-foreground">
          {t("RevenueByEmirate")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("RevenueByEmirateDescription")}
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-13.75 px-6 text-xs uppercase">#</TableHead>
            <TableHead className="min-w-50 text-xs uppercase">
              {t("Emirate")}
            </TableHead>
            <TableHead className="min-w-42.5 text-xs uppercase">
              {t("Orders")}
            </TableHead>
            <TableHead className="min-w-50 text-xs uppercase">
              {t("Revenue")} ({tCommon("AED")})
            </TableHead>
            <TableHead className="min-w-62.5 text-xs uppercase">
              {t("Distribution")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.city_id} className="h-12">
              <TableCell className="px-6 text-xs text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="text-sm font-semibold text-foreground">
                {item.name}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <span className="font-medium tabular-nums">
                    {item.orders}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({item.share_pct}%)
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-semibold tabular-nums">
                {tCommon("AED")} {item.revenue.toLocaleString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-35 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(item.share_pct, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="min-w-12 text-xs text-muted-foreground tabular-nums">
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
            <TableCell />
            <TableCell className="font-semibold tabular-nums">
              {totalOrders}
            </TableCell>
            <TableCell className="font-semibold tabular-nums">
              {tCommon("AED")} {totalRevenue.toLocaleString()}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableFooter>
      </Table>
    </Card>
  );
}
