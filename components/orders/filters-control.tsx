import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Download, Search } from "lucide-react";
import { orderStatuses } from "@/constants/orders";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseAsString, useQueryState } from "nuqs";

export default function FiltersControl() {
  const t = useTranslations("Orders");
  const [queryParam, setQueryParam] = useQueryState(
    "query",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );
  const [dateTo, setDateTo] = useQueryState(
    "dateTo",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );
  const [dateFrom, setDateFrom] = useQueryState(
    "dateFrom",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <div>
      <Tabs
        value={status}
        onValueChange={(value) => {
          void setStatus(value);
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
                value={queryParam}
                onChange={(e) => void setQueryParam(e.target.value || null)}
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
                  void setDateFrom(event.target.value || null);
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm "
              />
            </Field>

            <Field className="w-auto">
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  void setDateTo(event.target.value || null);
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
