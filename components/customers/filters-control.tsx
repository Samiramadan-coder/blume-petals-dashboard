"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
// import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";
import { Download, Search } from "lucide-react";
// import { customersStatuses } from "@/constants/customers";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { parseAsString, useQueryState } from "nuqs";
import { Checkbox } from "../ui/checkbox";

export default function FiltersControl() {
  const t = useTranslations("Customers");

  const [queryParam, setQueryParam] = useQueryState(
    "query",
    parseAsString
      .withDefault("")
      .withOptions({ history: "push", shallow: false }),
  );

  const [isAdmin, setIsAdmin] = useQueryState(
    "is_admin",
    parseAsString
      .withDefault("false")
      .withOptions({ history: "push", shallow: false }),
  );

  const [isBlocked, setIsBlocked] = useQueryState(
    "is_blocked",
    parseAsString
      .withDefault("false")
      .withOptions({ history: "push", shallow: false }),
  );

  // const [statusParam, setStatusParam] = useQueryState(
  //   "status",
  //   parseAsString
  //     .withDefault("all")
  //     .withOptions({ history: "push", shallow: false }),
  // );

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-4">
          <Field className="w-auto">
            <InputGroup className="h-10 bg-white">
              <InputGroupInput
                placeholder={t("SearchPlaceholder")}
                value={queryParam}
                onChange={(e) => setQueryParam(e.target.value)}
              />
              <InputGroupAddon align="inline-start">
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </Field>

          <Field orientation="horizontal" className="w-auto">
            <Checkbox
              id="is-admin-checkbox"
              name="is-admin-checkbox"
              checked={isAdmin === "true"}
              onCheckedChange={(checked) =>
                setIsAdmin(checked ? "true" : "false")
              }
            />
            <FieldLabel htmlFor="is-admin-checkbox">
              {t("Filters.IsAdmin")}
            </FieldLabel>
          </Field>

          <Field orientation="horizontal" className="w-auto">
            <Checkbox
              id="is-blocked-checkbox"
              name="is-blocked-checkbox"
              checked={isBlocked === "true"}
              onCheckedChange={(checked) =>
                setIsBlocked(checked ? "true" : "false")
              }
            />
            <FieldLabel htmlFor="is-blocked-checkbox">
              {t("Filters.IsBlocked")}
            </FieldLabel>
          </Field>
        </div>

        <Button
          variant="outline"
          className="h-10 w-30 bg-white text-muted-foreground text-xs"
        >
          <Download />
          Export CSV
        </Button>
      </div>

      {/* <Tabs
        value={statusParam}
        onValueChange={(value) => setStatusParam(value)}
      >
        <TabsList className="h-10! rounded-xl bg-muted-foreground/10 p-2">
          {customersStatuses(t).map((stat) => (
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
      </Tabs> */}
    </div>
  );
}
