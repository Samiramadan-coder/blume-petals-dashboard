import { cn } from "@/lib/utils";
import { parseAsString, useQueryState } from "nuqs";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { T } from "@/types/shared";
import { useTranslations } from "next-intl";

const types = (t: T) => [
  { value: "all", label: t("Filters.All") },
  { value: "order", label: t("Filters.Order") },
  { value: "promo", label: t("Filters.Promo") },
  { value: "system", label: t("Filters.System") },
];

export default function FiltersControl() {
  const t = useTranslations("Notifications");

  const [type, setType] = useQueryState(
    "type",
    parseAsString
      .withDefault("all")
      .withOptions({ history: "push", shallow: false }),
  );

  return (
    <Tabs
      value={type}
      onValueChange={(value) => {
        void setType(value);
      }}
    >
      <TabsList className="h-auto! rounded-xl bg-muted-foreground/10 p-2 flex-wrap">
        {types(t).map((stat) => (
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
  );
}
