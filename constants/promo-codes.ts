import { DataTableColumn } from "@/components/reusable/data-table";
import { T } from "@/types/shared";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Code"),
  },
  {
    label: t("Table.Discount"),
  },
  {
    label: t("Table.Usage"),
  },
  {
    label: t("Table.ValidDates"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.Actions"),
  },
];
