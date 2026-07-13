import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { OccasionCollectionType } from "@/types/occasions";
import { T } from "@/types/shared";

export const occasionTypes = (
  t: T,
): {
  label: string;
  value: OccasionCollectionType;
}[] => [
  {
    label: t("Bouquet"),
    value: "bouquet",
  },
  {
    label: t("Preserved"),
    value: "preserved",
  },
  {
    label: t("Gift"),
    value: "gift",
  },
  {
    label: t("Seasonal"),
    value: "seasonal",
  },
  {
    label: t("Wedding"),
    value: "wedding",
  },
  {
    label: t("Eid"),
    value: "eid",
  },
  {
    label: t("Corporate"),
    value: "corporate",
  },
];

export const columns: DataTableColumn[] = [
  {
    key: "banner",
    label: "Banner",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "date-range",
    label: "Date Range",
  },
  {
    key: "products",
    label: "Products",
  },
  {
    key: "visibility",
    label: "Visibility",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

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
