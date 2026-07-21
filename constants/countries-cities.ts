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
