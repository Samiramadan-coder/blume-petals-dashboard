"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { createParser, parseAsString, useQueryStates } from "nuqs";
import { Button } from "../ui/button";
import { CalendarIcon, ChartNoAxesColumn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parse } from "date-fns";
import { Calendar } from "../ui/calendar";

export const parseAsDate = createParser<Date>({
  parse: (value) => {
    const date = parse(value, "yyyy-MM-dd", new Date());
    return Number.isNaN(date.getTime()) ? null : date;
  },

  serialize: (value) => {
    return format(value, "yyyy-MM-dd");
  },
});

export default function FiltersControl() {
  const t = useTranslations("Reports.Filters");
  const [filters, setFilters] = useQueryStates({
    days: parseAsString
      .withDefault("30")
      .withOptions({ history: "push", shallow: false }),
    compare: parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
    from: parseAsDate.withOptions({ history: "push", shallow: false }),
    to: parseAsDate.withOptions({ history: "push", shallow: false }),
  });

  return (
    <div className="flex items-center gap-4">
      <Select
        value={filters.days}
        onValueChange={(value) => setFilters({ days: value })}
      >
        <SelectTrigger className="w-full max-w-48 min-h-10 bg-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="1">{t("Today")}</SelectItem>
            <SelectItem value="7">{t("Last7Days")}</SelectItem>
            <SelectItem value="30">{t("Last30Days")}</SelectItem>
            <SelectItem value="60">{t("LastMonth")}</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal h-10 bg-white",
              !filters.from && !filters.to && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 size-4" />

            {filters.from ? (
              filters.to ? (
                <>
                  {format(filters.from, "dd MMM yyyy")} -{" "}
                  {format(filters.to, "dd MMM yyyy")}
                </>
              ) : (
                format(filters.from, "dd MMM yyyy")
              )
            ) : (
              <span>{t("SelectDate")}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: filters.from ?? undefined,
              to: filters.to ?? undefined,
            }}
            onSelect={(range) => {
              setFilters({
                from: range?.from ?? null,
                to: range?.to ?? null,
              });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="outline"
        className={cn(
          "h-10 bg-white",
          filters.compare === "1" && "bg-primary/20",
        )}
        onClick={() =>
          setFilters({ compare: filters.compare === "1" ? "" : "1" })
        }
      >
        <ChartNoAxesColumn />
        {t("CompareToPreviousPeriod")}
      </Button>
    </div>
  );
}
