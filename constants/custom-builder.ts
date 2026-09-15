import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";

// Table Column
export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Photo"),
  },
  {
    label: t("Table.Name"),
  },
  {
    label: t("Table.ShapesCount"),
  },
  {
    label: t("Table.Actions"),
  },
];

export const ribbonsColumns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Name"),
  },
  {
    label: t("Table.Color"),
  },
  {
    label: t("Table.Price"),
  },
  {
    label: t("Table.Actions"),
  },
];
