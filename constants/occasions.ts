import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/date-sortable-table";

// Occasion Columns
export const columns = (t: T): DataTableColumn[] => [
  {
    key: "photo",
    label: t("Table.Photo"),
  },
  {
    key: "name",
    label: t("Table.Name"),
  },
  {
    key: "dateRange",
    label: t("Table.DateRange"),
  },
  {
    key: "products",
    label: t("Table.Products"),
  },
  {
    key: "visibility",
    label: t("Table.Visibility"),
  },
  {
    key: "status",
    label: t("Table.Status"),
  },
  {
    key: "actions",
    label: t("Table.Actions"),
  },
];

// Occasion Colors
export const colors: string[] = [
  "#f4c2c2",
  "#e6dcd2",
  "#ffcba4",
  "#cbb682",
  "#9caf88",
  "#c7b8ea",
  "#7d947b",
  "#ed8074",
  "#dcae96",
  "#d4e4bc",
];
