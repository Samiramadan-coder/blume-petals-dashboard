import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { promoCodeStatuses } from "@/constants/promo-codes";
import { parseAsString, useQueryStates, debounce } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FiltersControl() {
  const t = useTranslations("PromoCodes");

  const [{ query, status }, setFilters] = useQueryStates({
    query: parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
    status: parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
    page: parseAsString
      .withDefault("1")
      .withOptions({ history: "push", shallow: false }),
  });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput
                value={query}
                onChange={(e) => {
                  const value = e.target.value || "";

                  void setFilters(
                    { query: value, page: "1" },
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
        </div>
      </div>

      <Tabs
        value={status}
        onValueChange={(value) => {
          void setFilters({ status: value, page: "1" });
        }}
      >
        <TabsList className="h-auto! rounded-xl bg-muted flex-wrap p-1">
          {promoCodeStatuses(t).map((stat) => (
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
    </div>
  );
}
