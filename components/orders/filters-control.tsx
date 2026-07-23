import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Download, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { orderStatuses } from "@/constants/orders";
import { useEffect, useRef, useState } from "react";
import { useQueryParam } from "@/hooks/use-search-params";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

export default function FiltersControl() {
  const firstTrigger = useRef(true);
  const t = useTranslations("Orders");
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const { setQueryParam } = useQueryParam();
  const [dateTo, setDateTo] = useState(searchParams.get("dateTo") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [dateFrom, setDateFrom] = useState(searchParams.get("dateFrom") || "");

  useEffect(() => {
    if (firstTrigger.current) {
      firstTrigger.current = false;
      return;
    }

    const timer = setTimeout(() => {
      setQueryParam("query", query);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div>
      <Tabs
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          setQueryParam("status", value);
        }}
      >
        <TabsList className="h-10! rounded-xl bg-muted-foreground/10 p-2">
          {orderStatuses(t).map((stat) => (
            <TabsTrigger
              key={stat.value}
              value={stat.value}
              className={cn(
                `h-8 rounded-lg px-4 text-sm font-medium text-muted-foreground hover:text-foreground data-[state=active]:bg-white data-[state=active]:shadow-sm cursor-pointer`,
              )}
            >
              {stat.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("SearchPlaceholder")}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex items-center gap-2">
            <Field className="w-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  setDateFrom(event.target.value);
                  setQueryParam("dateFrom", event.target.value);
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm "
              />
            </Field>

            <Field className="w-auto">
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  setDateTo(event.target.value);
                  setQueryParam("dateTo", event.target.value);
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm"
              />
            </Field>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
        >
          <Download />
          {t("ExportCSV")}
        </Button>
      </div>
    </div>
  );
}
