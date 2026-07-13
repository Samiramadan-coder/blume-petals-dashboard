import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { OccasionCollectionType } from "@/types/occasions";
import { T } from "@/types/shared";

export const categoryTypes = (
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
