"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { FastestMovingItem } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";

export default function FastestMovingItems({
  fastestMoving,
}: {
  fastestMoving: FastestMovingItem[];
}) {
  const t = useTranslations("Reports.InventoryStock");
  const locale = useLocale();

  const data = [...fastestMoving].sort(
    (a, b) => Number(b.units) - Number(a.units),
  );

  function getName(item: FastestMovingItem) {
    return locale === "ar" && item.name_ar ? item.name_ar : item.name_en;
  }

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="flex items-center justify-between gap-4 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("FastestMovingItems")}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("FastestMovingDescription")}
          </p>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("Entries", {
            count: data.length,
          })}
        </p>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="w-20 px-5 text-xs">{t("Rank")}</TableHead>

            <TableHead className="min-w-60 text-xs">{t("Item")}</TableHead>

            <TableHead className="min-w-45 text-xs">{t("Sku")}</TableHead>

            <TableHead className="min-w-30 text-xs">{t("Color")}</TableHead>

            <TableHead className="min-w-25 text-xs">{t("Size")}</TableHead>

            <TableHead className="min-w-30 text-xs">{t("UnitsSold")}</TableHead>

            <TableHead className="min-w-30 text-xs">{t("Available")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.variant_id} className="h-12">
              <TableCell className="px-5 text-xs text-muted-foreground tabular-nums">
                {index + 1}
              </TableCell>

              <TableCell>
                <p className="text-sm font-medium text-foreground">
                  {getName(item)}
                </p>
              </TableCell>

              <TableCell className="text-xs text-muted-foreground">
                {item.sku}
              </TableCell>

              <TableCell>
                {item.color_slug ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full border"
                      style={{
                        backgroundColor: item.color_slug,
                      }}
                    />

                    <span className="text-xs capitalize text-muted-foreground">
                      {item.color_slug}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>

              <TableCell className="text-xs text-muted-foreground">
                {item.size ?? "—"}
              </TableCell>

              <TableCell className="text-sm font-semibold tabular-nums">
                {item.units}
              </TableCell>

              <TableCell className="text-sm tabular-nums">
                {item.available.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
