import {
  Flower2,
  Balloon,
  Gift,
  Sun,
  Gem,
  Moon,
  BriefcaseBusiness,
} from "lucide-react";
import { T } from "@/types/shared";
import { createElement } from "react";
import { Category, Icon } from "@/types/categories";
import { DataTableColumn } from "@/components/reusable/date-sortable-table";

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
    name: { ar: "باقة", en: "Bouquet" },
    visibility: true,
    status: "live",
    color: "#ffcba4",
    icon: 1,
  },
  {
    id: 2,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 3,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 4,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 5,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 6,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 7,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 8,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 9,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
  {
    id: 10,
    name: { ar: "محفوظة", en: "Preserved" },
    visibility: false,
    status: "live",
    color: "#dcae96",
    icon: 2,
  },
];
