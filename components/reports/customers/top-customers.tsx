"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import { TopCustomer } from "@/types/reports";

const avatarStyles = [
  "bg-[#829b82]",
  "bg-[#ee7b72]",
  "bg-[#839b82]",
  "bg-[#cfb77b]",
  "bg-[#cdb57a]",
  "bg-[#819982]",
  "bg-[#493900]",
  "bg-[#ec796f]",
  "bg-[#ccb77b]",
  "bg-[#4c3900]",
];

export default function TopCustomers({
  customers,
}: {
  customers: TopCustomer[];
}) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("Reports.CustomerStats");

  return (
    <Card className="overflow-hidden border border-primary/30 p-0 ring-0!">
      <header className="flex items-center justify-between gap-4 px-6 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("TopCustomers")}
        </p>
      </header>

      <div className="px-6 pb-5">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-25 text-xs">{t("Rank")}</TableHead>
              <TableHead className="min-w-75 text-xs">{t("Name")}</TableHead>
              <TableHead className="min-w-32.5 text-xs">
                {t("Orders")}
              </TableHead>
              <TableHead className="min-w-40 text-xs">
                {t("TotalSpent")}
              </TableHead>
              <TableHead className="min-w-37.5 text-xs">
                {t("LastOrder")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer, index) => (
              <TableRow key={customer.user_id} className="h-14">
                <TableCell className="text-sm font-semibold tabular-nums">
                  {index + 1}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "grid size-8 shrink-0 place-content-center rounded-full text-xs font-semibold text-white",
                        avatarStyles[index % avatarStyles.length],
                      )}
                    >
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {customer.name}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm font-medium tabular-nums">
                  {customer.lifetime_orders}
                </TableCell>

                <TableCell className="text-sm font-semibold tabular-nums">
                  {tCommon("AED")}{" "}
                  {Number(customer.lifetime_spent).toLocaleString()}
                </TableCell>

                <TableCell className="text-xs text-muted-foreground">
                  {formatDate(customer.last_order_at || "")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
