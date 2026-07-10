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
import { Category, Icon } from "@/types/categories";
import { DataTableColumn } from "@/components/reusable/date-sortable-table";

type T = (key: string) => string;

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

export const icons = (t: T): Icon[] => [
  {
    id: 1,
    icon: createElement(Flower2, { className: "size-5" }),
    label: t("Bouquet"),
  },
  {
    id: 2,
    icon: createElement(Balloon, { className: "size-5" }),
    label: t("Preserved"),
  },
  {
    id: 3,
    icon: createElement(Gift, { className: "size-5" }),
    label: t("Gift"),
  },
  {
    id: 4,
    icon: createElement(Sun, { className: "size-5" }),
    label: t("Seasonal"),
  },
  {
    id: 5,
    icon: createElement(Gem, { className: "size-5" }),
    label: t("Wedding"),
  },
  {
    id: 6,
    icon: createElement(Moon, { className: "size-5" }),
    label: t("Eid"),
  },
  {
    id: 7,
    icon: createElement(BriefcaseBusiness, { className: "size-5" }),
    label: t("Corporate"),
  },
];

export const columns = (t: T): DataTableColumn[] => [
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

export const initialCategories: Category[] = [
  {
    id: 1,
    name: {
      ar: "باقة",
      en: "Bouquet",
    },
    visibility: true,
    status: "live",
    color: "#F4C2C2",
    icon: 1,
  },
];
