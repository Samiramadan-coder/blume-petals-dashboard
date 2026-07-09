import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { OccasionCollection } from "@/types/occasions-collections";

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

export const initialOccasionsCollections: OccasionCollection[] = [
  {
    id: 1,
    banner: "/icon.png",
    name: "Bouquet",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    products: 24,
    visibility: true,
    color: "#FFFFF0",
  },
  {
    id: 2,
    banner: "/icon.png",
    name: "Preserved",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    products: 12,
    visibility: false,
    color: "#DCAE96",
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
