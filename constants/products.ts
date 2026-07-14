import { T } from "@/types/shared";
import { Product } from "@/types/products";
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
    value: "s",
    label: t("Labels.S"),
  },
  {
    value: "m",
    label: t("Labels.M"),
  },
  {
    value: "l",
    label: t("Labels.L"),
  },
  {
    value: "xl",
    label: t("Labels.XL"),
  },
];

// Colors
export const colors = (t: T) => [
  {
    value: "#F4C2C2",
    label: t("Labels.BlushPink"),
  },
  {
    value: "#FFFFF0",
    label: t("Labels.Ivory"),
  },
  {
    value: "#7D947B",
    label: t("Labels.Sage"),
  },
  {
    value: "#9B1C1C",
    label: t("Labels.DeepRed"),
  },
  {
    value: "#C7B8EA",
    label: t("Labels.Lavender"),
  },
  {
    value: "#FFCBA4",
    label: t("Labels.Peach"),
  },
  {
    value: "#FFFFFF",
    label: t("Labels.White"),
  },
  {
    value: "#CBB682",
    label: t("Labels.Gold"),
  },
  {
    value: "#ED8074",
    label: t("Labels.Terracotta"),
  },
  {
    value: "#DCAE96",
    label: t("Labels.DustyRose"),
  },
];

// Product Statuses
export const productStatuses = (t: T) => [
  {
    label: t("Labels.Active"),
    value: "active",
  },
  {
    label: t("Labels.Draft"),
    value: "draft",
  },
];
