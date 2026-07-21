import { T } from "@/types/shared";
import { CategoryType } from "@/types/categories";
import { DataTableColumn } from "@/components/reusable/date-sortable-table";

// Categories Types
export const categoryTypes = (
  t: T,
): {
  label: string;
  value: CategoryType;
}[] => [
  {
    label: t("default"),
    value: "default",
  },
  {
    label: t("AddOns"),
    value: "addon",
  },
];

// Categories Colors
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

// Categories Columns
export const columns = (t: T): DataTableColumn[] => [
  {
    key: "photo",
    label: t("Photo"),
  },
  {
    key: "name",
    label: t("CategoryName"),
  },
  {
    key: "products",
    label: t("Products"),
  },
  {
    key: "visibility",
    label: t("Visibility"),
  },
  {
    key: "status",
    label: t("Status"),
  },
  {
    key: "actions",
    label: t("Actions"),
  },
];
