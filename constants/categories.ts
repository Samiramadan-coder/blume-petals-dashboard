import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import { Category, Icon } from "@/types/categories";
import {
  Flower2,
  Balloon,
  Gift,
  Sun,
  Gem,
  Moon,
  BriefcaseBusiness,
} from "lucide-react";
import { createElement } from "react";

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

export const icons: Icon[] = [
  {
    id: 1,
    icon: createElement(Flower2, { className: "size-5" }),
    label: "Bouquet",
  },
  {
    id: 2,
    icon: createElement(Balloon, { className: "size-5" }),
    label: "Preserved",
  },
  {
    id: 3,
    icon: createElement(Gift, { className: "size-5" }),
    label: "Gift",
  },
  {
    id: 4,
    icon: createElement(Sun, { className: "size-5" }),
    label: "Seasonal",
  },
  {
    id: 5,
    icon: createElement(Gem, { className: "size-5" }),
    label: "Wedding",
  },
  {
    id: 6,
    icon: createElement(Moon, { className: "size-5" }),
    label: "Eid",
  },
  {
    id: 7,
    icon: createElement(BriefcaseBusiness, { className: "size-5" }),
    label: "Corporate",
  },
];

export const columns: DataTableColumn[] = [
  {
    key: "name",
    label: "Name",
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
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const initialCategories: Category[] = [
  {
    id: 1,
    name: "Bouquets",
    visibility: true,
    status: "live",
    color: "#F4C2C2",
    icon: 1,
  },
  {
    id: 2,
    name: "Preserved",
    visibility: true,
    status: "live",
    color: "#C7B8EA",
    icon: 2,
  },
  {
    id: 3,
    name: "Gifts",
    visibility: true,
    status: "live",
    color: "#FFCBA4",
    icon: 3,
  },
];
