import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { T } from "@/types/shared";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Name"),
    key: "name",
  },
  {
    label: t("Table.Address"),
    key: "address",
  },
  {
    label: t("Table.ReadyInText"),
    key: "ready_in_text",
  },
  {
    label: t("Table.Hours"),
    key: "hours",
  },
  {
    label: t("Table.Status"),
    key: "status",
  },
  {
    label: t("Table.Actions"),
    key: "actions",
  },
];
