import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { T } from "@/types/shared";

export const columns = (t: T): DataTableColumn[] => [
  {
    key: "name",
    label: t("Table.Name"),
  },
  {
    key: "code",
    label: t("Table.CountryCode"),
  },
  {
    key: "is_active",
    label: t("Table.Status"),
  },
  {
    key: "actions",
    label: t("Table.Actions"),
  },
];

export const cityColumns = (t: T): DataTableColumn[] => [
  {
    key: "name",
    label: t("Table.Name"),
  },
  {
    key: "country_name",
    label: t("Table.CountryName"),
  },
  {
    key: "delivery_fee",
    label: t("Table.DeliveryFee"),
  },
  {
    key: "is_active",
    label: t("Table.Status"),
  },
  {
    key: "actions",
    label: t("Table.Actions"),
  },
];
