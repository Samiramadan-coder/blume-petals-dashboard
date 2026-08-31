"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StockLevel } from "@/types/reports";
import { useLocale, useTranslations } from "next-intl";

type TypeFilter = "all" | "product" | "flower" | "addon";

type StatusFilter = "all" | "in_stock" | "low_stock" | "out_of_stock";

export default function StockLevels({ levels }: { levels: StockLevel[] }) {
  const t = useTranslations("Reports.InventoryStock");
  const locale = useLocale();

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const lowStockCount = levels.filter(
    (item) => item.status === "low_stock",
  ).length;

  const outOfStockCount = levels.filter(
    (item) => item.status === "out_of_stock",
  ).length;

  const filteredLevels = useMemo(() => {
    return levels.filter((item) => {
      const normalizedKind = item.kind === "add_on" ? "addon" : item.kind;

      const matchesType = typeFilter === "all" || normalizedKind === typeFilter;

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesType && matchesStatus;
    });
  }, [levels, typeFilter, statusFilter]);

  function getName(item: StockLevel) {
    return locale === "ar" && item.name_ar ? item.name_ar : item.name_en;
  }

  function getType(kind: string) {
    switch (kind) {
      case "product":
        return t("Product");

      case "flower":
        return t("FlowerType");

      case "addon":
      case "add_on":
        return t("AddOn");

      default:
        return kind;
    }
  }

  function getStatus(status: string) {
    switch (status) {
      case "in_stock":
        return t("InStock");

      case "low_stock":
        return t("LowStock");

      case "out_of_stock":
        return t("OutOfStock");

      default:
        return status;
    }
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "in_stock":
        return "bg-green-700/10 text-green-700";

      case "low_stock":
        return "bg-orange-500/10 text-orange-500";

      case "out_of_stock":
        return "bg-red-500/10 text-red-500";

      default:
        return "bg-muted text-muted-foreground";
    }
  }

  function getTypeClass(kind: string) {
    switch (kind) {
      case "flower":
        return "bg-green-700/10 text-green-700";

      case "addon":
      case "add_on":
        return "bg-red-500/10 text-red-500";

      default:
        return "bg-primary/10 text-primary";
    }
  }

  const typeFilters: {
    value: TypeFilter;
    label: string;
  }[] = [
    {
      value: "all",
      label: t("All"),
    },
    {
      value: "product",
      label: t("Product"),
    },
    {
      value: "flower",
      label: t("FlowerType"),
    },
    {
      value: "addon",
      label: t("AddOn"),
    },
  ];

  const statusFilters: {
    value: StatusFilter;
    label: string;
  }[] = [
    {
      value: "all",
      label: t("All"),
    },
    {
      value: "in_stock",
      label: t("InStock"),
    },
    {
      value: "low_stock",
      label: t("LowStock"),
    },
    {
      value: "out_of_stock",
      label: t("Out"),
    },
  ];

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="flex items-center justify-between gap-6 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t("StockLevelsOverview")}
          </p>

          <p className="mt-0.5 text-xs text-muted-foreground">
            {t("StockLevelsSummary", {
              count: levels.length,
              low: lowStockCount,
              out: outOfStockCount,
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg bg-muted/40 p-1">
            {typeFilters.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTypeFilter(filter.value)}
                className={cn(
                  "h-7 rounded-md px-3 text-xs font-normal hover:bg-background",
                  typeFilter === filter.value &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center rounded-lg bg-muted/40 p-1">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "h-7 rounded-md px-3 text-xs font-normal hover:bg-background",
                  statusFilter === filter.value &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="min-w-70 px-5 text-xs uppercase">
              {t("Item")}
            </TableHead>

            <TableHead className="min-w-32.5 text-xs uppercase">
              {t("Type")}
            </TableHead>

            <TableHead className="min-w-25 text-xs uppercase">
              {t("Stock")}
            </TableHead>

            <TableHead className="min-w-30 text-xs uppercase">
              {t("ReorderAt")}
            </TableHead>

            <TableHead className="min-w-32.5 text-xs uppercase">
              {t("Status")}
            </TableHead>

            <TableHead className="min-w-27.5 text-xs uppercase">
              {t("Reserved")}
            </TableHead>

            <TableHead className="min-w-27.5 text-xs uppercase">
              {t("Available")}
            </TableHead>

            <TableHead className="min-w-35 text-xs uppercase">
              {t("StockValue")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredLevels.map((item) => (
            <TableRow
              key={item.variant_id}
              className={cn(
                "h-14",
                item.status === "low_stock" && "border-s-2 border-s-orange-400",
                item.status === "out_of_stock" && "border-s-2 border-s-red-400",
              )}
            >
              <TableCell className="px-5">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {getName(item)}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {item.sku}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    "inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium",
                    getTypeClass(item.kind),
                  )}
                >
                  {getType(item.kind)}
                </span>
              </TableCell>

              <TableCell className="text-sm font-semibold tabular-nums">
                {item.stock}
              </TableCell>

              <TableCell>
                <span className="inline-flex min-w-16 justify-center rounded-lg border bg-muted/30 px-3 py-1.5 text-xs tabular-nums">
                  {item.threshold}
                </span>
              </TableCell>

              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium",
                    getStatusClass(item.status),
                  )}
                >
                  <span className="size-1.5 rounded-full bg-current" />

                  {getStatus(item.status)}
                </span>
              </TableCell>

              <TableCell className="text-sm tabular-nums">
                {item.reserved}
              </TableCell>

              <TableCell className="text-sm tabular-nums">
                {item.available}
              </TableCell>

              <TableCell className="text-sm font-medium tabular-nums">
                {Number(item.value).toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
