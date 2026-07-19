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
    label: t("Table.Category"),
  },
  {
    label: t("Table.Price"),
  },
  {
    label: t("Table.Stock"),
  },
  {
    label: t("Table.Rating"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.Actions"),
    className: "text-center",
  },
];

// Sizes
export const sizes = (t: T) => [
  {
    value: "S",
    label: t("Labels.S"),
  },
  {
    value: "M",
    label: t("Labels.M"),
  },
  {
    value: "L",
    label: t("Labels.L"),
  },
  {
    value: "XL",
    label: t("Labels.XL"),
  },
];

// Colors
export const colors = [
  "#F4C2C2",
  "#FFFFF0",
  "#7D947B",
  "#9B1C1C",
  "#C7B8EA",
  "#FFCBA4",
  "#FFFFFF",
  "#CBB682",
  "#ED8074",
  "#DCAE96",
];

// Product Statuses
export const productStatuses = (t: T) => [
  {
    label: t("Labels.Active"),
    value: "published",
  },
  {
    label: t("Labels.Draft"),
    value: "draft",
  },
];
