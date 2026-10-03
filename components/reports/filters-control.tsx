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
import { useState } from "react";
import { createParser, parseAsString, useQueryStates } from "nuqs";
import { Button } from "../ui/button";
import { CalendarIcon, ChartNoAxesColumn, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format, parse } from "date-fns";
import { Calendar } from "../ui/calendar";
import type { DateRange } from "react-day-picker";

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

  // The range being picked. It only reaches the URL (and the API) once both
  // ends are chosen, a start date alone is not a report period.
  const [draft, setDraft] = useState<DateRange | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const applied: DateRange | undefined =
    filters.from && filters.to
      ? { from: filters.from, to: filters.to }
      : undefined;

  const shown = draft ?? applied;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <Select
        value={filters.days}
        onValueChange={(value) => {
          // A preset replaces a custom range, the two never apply together
          setDraft(undefined);
          void setFilters({ days: value, from: null, to: null });
        }}
      >
        <SelectTrigger
          aria-label={t("Last30Days")}
          className="w-full max-w-48 min-h-10 bg-white"
        >
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

      <div className="flex items-center gap-1">
        <Popover
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            // Closing with only a start date picked drops the unfinished range
            if (!next) setDraft(undefined);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-start font-normal h-10 bg-white",
                !shown?.from && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="me-2 size-4" />

              {shown?.from ? (
                shown.to ? (
                  <>
                    {format(shown.from, "dd MMM yyyy")} -{" "}
                    {format(shown.to, "dd MMM yyyy")}
                  </>
                ) : (
                  format(shown.from, "dd MMM yyyy")
                )
              ) : (
                <span>{t("SelectDate")}</span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-auto max-w-[calc(100vw-2rem)] overflow-auto p-0"
            align="start"
          >
            <Calendar
              mode="range"
              selected={shown}
              onSelect={(range) => {
                if (range?.from && range.to) {
                  setDraft(undefined);
                  setOpen(false);
                  void setFilters({ from: range.from, to: range.to });
                  return;
                }

                setDraft(range);
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {applied && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("ClearDates")}
            onClick={() => {
              setDraft(undefined);
              void setFilters({ from: null, to: null });
            }}
          >
            <X className="size-4 text-muted-foreground" />
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        aria-pressed={filters.compare === "1"}
        className={cn(
          "h-10 bg-white",
          filters.compare === "1" && "bg-primary/20",
        )}
        onClick={() =>
          void setFilters({ compare: filters.compare === "1" ? "" : "1" })
        }
      >
        <ChartNoAxesColumn />
        {t("CompareToPreviousPeriod")}
      </Button>
    </div>
  );
}
