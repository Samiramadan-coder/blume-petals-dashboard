"use client";

import { parseAsString, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";

export default function ReportsTabs() {
  const t = useTranslations("Reports");

  const [tab, setTab] = useQueryState(
    "tab",
    parseAsString
      .withDefault("sales")
      .withOptions({ history: "push", shallow: false }),
  );

  const tabs = [
    { value: "sales", label: t("Sales") },
    { value: "inventory", label: t("Inventory") },
    { value: "analytics", label: t("Analytics") },
    { value: "customers", label: t("Customers") },
  ];

  return (
    <div>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList variant="line" className="h-auto! gap-3">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="h-10 text-muted-foreground after:bg-primary"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Separator />
    </div>
  );
}
