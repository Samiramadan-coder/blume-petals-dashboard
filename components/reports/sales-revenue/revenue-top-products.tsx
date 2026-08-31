"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TopProduct } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";

const avatarClasses = [
  "bg-[#cfba80]",
  "bg-[#7f9b80]",
  "bg-[#ac933e]",
  "bg-[#ef7c74]",
  "bg-[#cbb87a]",
  "bg-[#819b80]",
  "bg-[#e5a36e]",
  "bg-[#9e8a5c]",
  "bg-[#a7c79f]",
  "bg-[#9a743c]",
];

export default function RevenueTopProducts({
  topProducts,
}: {
  topProducts: TopProduct[];
}) {
  const t = useTranslations("Reports.SalesRevenue");
  const tCommon = useTranslations("Common");
  const locale = useLocale();

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="flex items-center justify-between gap-4 px-6 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("TopSellingProducts")}
          </p>

          <p className="text-xs text-muted-foreground">
            {t("BasedOnRevenueSelectedPeriod")}
          </p>
        </div>

        <Link href="/products" className="text-xs font-medium text-primary">
          {t("ViewFullReport")} →
        </Link>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-22.5 px-4 text-xs uppercase">
              {t("Rank")}
            </TableHead>
            <TableHead className="min-w-75 text-xs uppercase">
              {t("Product")}
            </TableHead>
            <TableHead className="min-w-40 text-xs uppercase">
              {t("Category")}
            </TableHead>
            <TableHead className="min-w-35 text-xs uppercase">
              <span className="flex items-center gap-1">
                {t("UnitsSold")}
                <ArrowUpDown className="size-3 text-muted-foreground/50" />
              </span>
            </TableHead>
            <TableHead className="min-w-42.5 text-xs uppercase">
              <span className="flex items-center gap-1">
                {t("Revenue")} ({tCommon("AED")})
                <ArrowUpDown className="size-3 text-muted-foreground/50" />
              </span>
            </TableHead>
            <TableHead className="min-w-42.5 text-xs uppercase">
              {t("PercentOfTotal")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {topProducts.map((product, index) => (
            <TableRow key={`${product.sku}-${index}`} className="h-16">
              <TableCell className="px-4">
                <span
                  className={
                    index < 3
                      ? "grid size-6 place-content-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                      : "grid size-6 place-content-center rounded-full bg-muted text-xs font-semibold text-muted-foreground"
                  }
                >
                  {index + 1}
                </span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-3">
                  <div
                    className={`grid size-9 shrink-0 place-content-center rounded-lg text-xs font-semibold text-white uppercase ${
                      avatarClasses[index % avatarClasses.length]
                    }`}
                  >
                    {product[`name_${locale}`].slice(0, 2)}
                  </div>

                  <span className="text-sm font-medium text-foreground">
                    {product[`name_${locale}`]}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  {product.category}
                </span>
              </TableCell>

              <TableCell className="text-sm font-medium tabular-nums">
                {product.units}
              </TableCell>

              <TableCell className="text-sm font-semibold tabular-nums">
                {tCommon("AED")} {product.revenue}
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${Math.min(+product.share_pct, 100)}%`,
                      }}
                    />
                  </div>

                  <span className="min-w-10 text-xs text-muted-foreground tabular-nums">
                    {product.share_pct}%
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
