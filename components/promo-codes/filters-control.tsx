import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { cn } from "@/lib/utils";
import { Field } from "../ui/field";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { promoCodeStatuses } from "@/constants/promo-codes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function FiltersControl() {
  const t = useTranslations("PromoCodes");

  const [queryParam, setQueryParam] = useQueryState(
    "query",
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

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
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
        </div>
      </div>

      <Tabs
        value={status}
        onValueChange={(value) => {
          void setStatus(value);
        }}
      >
        <TabsList className="h-10! rounded-xl bg-muted-foreground/10 p-2">
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
