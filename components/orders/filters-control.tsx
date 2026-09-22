import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useState } from "react";
import { http } from "@/lib/http";
import { Field } from "../ui/field";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn, parseCsv } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Download, Search } from "lucide-react";
import { orderStatuses } from "@/constants/orders";
import { parseAsString, useQueryStates, debounce } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FiltersControl() {
  const t = useTranslations("Orders");
  const [loading, setLoading] = useState(false);

  const [{ query, status, channel, dateTo, dateFrom }, setFilters] =
    useQueryStates({
      page: parseAsString
        .withDefault("1")
        .withOptions({ history: "push", shallow: false }),
      query: parseAsString
        .withDefault("")
        .withOptions({ history: "push", shallow: false }),
      status: parseAsString
        .withDefault("all")
        .withOptions({ history: "push", shallow: false }),
      channel: parseAsString
        .withDefault("")
        .withOptions({ history: "push", shallow: false }),
      dateTo: parseAsString
        .withDefault("")
        .withOptions({ history: "push", shallow: false }),
      dateFrom: parseAsString
        .withDefault("")
        .withOptions({ history: "push", shallow: false }),
    });

  async function exportOrders() {
    setLoading(true);
    try {
      const { data } = await http.get<string>("/api/v1/admin/orders/export", {
        params: {
          query: query || "",
          status: status || "",
          channel: channel || "",
          dateTo: dateTo || "",
          dateFrom: dateFrom || "",
        },
      });
      parseCsv(data, `orders-export`);
    } catch (error) {
      console.error("Failed to export orders:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Tabs
        value={status}
        onValueChange={(value) => {
          void setFilters({ status: value, page: "1" });
        }}
      >
        <TabsList className="h-auto! rounded-xl bg-muted p-1 flex-wrap">
          {[{ label: t("All"), value: "all" }]
            .concat(orderStatuses(t))
            .map((stat) => (
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
                onChange={(e) => {
                  const value = e.target.value || null;

                  void setFilters(
                    {
                      query: value || null,
                    },
                    {
                      history: "replace",
                      limitUrlUpdates: value === "" ? undefined : debounce(500),
                    },
                  );
                }}
                placeholder={t("SearchPlaceholder")}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <div className="flex items-center flex-wrap gap-2">
            <Select
              value={channel}
              onValueChange={(value) =>
                void setFilters({ channel: value, page: "1" })
              }
            >
              <SelectTrigger className="h-10 min-h-10 w-40 bg-white px-3 py-2.5 leading-none">
                <SelectValue placeholder={t("AllChannels")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="">{t("AllChannels")}</SelectItem>
                  <SelectItem value="website">{t("Website")}</SelectItem>
                  <SelectItem value="mobile_app">{t("MobileApp")}</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Field className="w-auto">
              <Input
                type="date"
                value={dateFrom}
                onChange={(event) => {
                  void setFilters({
                    dateFrom: event.target.value || null,
                    page: "1",
                  });
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm"
              />
            </Field>

            <Field className="w-auto">
              <Input
                type="date"
                value={dateTo}
                onChange={(event) => {
                  void setFilters({
                    dateTo: event.target.value || null,
                    page: "1",
                  });
                }}
                className="h-10 min-w-35 bg-white px-3 py-2 text-sm"
              />
            </Field>
          </div>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
          onClick={exportOrders}
          disabled={loading}
        >
          {loading && <Spinner />}
          <Download />
          {t("ExportCSV")}
        </Button>
      </div>
    </div>
  );
}
