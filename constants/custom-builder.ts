import AddOns from "@/components/custom-builder/add-ons";
import Flowers from "@/components/custom-builder/flowers";
import PricingRules from "@/components/custom-builder/pricing-rules";
import Template from "@/components/custom-builder/template";
import Wrapping from "@/components/custom-builder/wrapping";
import { DataTableColumn } from "@/components/reusable/date-sortable-table";
import {
  Flower as FlowerType,
  Ribbon,
  Tab,
  TabContent,
  Template as TemplateType,
  Wrapping as WrappingType,
} from "@/types/custom-builder";
import { createElement } from "react";

export const tabs: Tab[] = [
  { label: "Templates", value: "templates" },
  { label: "Flowers", value: "flowers" },
  { label: "Wrapping & Ribbons", value: "wrapping" },
  { label: "Add-ons", value: "addons" },
  { label: "Pricing Rules", value: "pricing-rules" },
];

export const tabContents: TabContent[] = [
  {
    value: "templates",
    content: createElement(Template),
  },
  {
    value: "flowers",
    content: createElement(Flowers),
  },
  {
    value: "wrapping",
    content: createElement(Wrapping),
  },
  {
    value: "addons",
    content: createElement(AddOns),
  },
  {
    value: "pricing-rules",
    content: createElement(PricingRules),
  },
];

/**
 * Control On Templates
 */
export const columns: DataTableColumn[] = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "S",
    label: "S (AED / ~fl)",
  },
  {
    key: "M",
    label: "M (AED / ~fl)",
  },
  {
    key: "L",
    label: "L (AED / ~fl)",
  },
  {
    key: "XL",
    label: "XL (AED / ~fl)",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const initialTemplates: TemplateType[] = [
  {
    active: true,
    id: 1,
    name: "Template 1",
    icon: "",
    emoji: "🌸",
    prices: [
      { size: "S", flowers: 8, price: 10 },
      { size: "M", flowers: 12, price: 15 },
      { size: "L", flowers: 18, price: 20 },
      { size: "XL", flowers: 24, price: 25 },
    ],
  },
  {
    active: false,
    id: 2,
    name: "Template 2",
    icon: "",
    emoji: "🌸",
    prices: [
      { size: "S", flowers: 8, price: 10 },
      { size: "M", flowers: 12, price: 15 },
      { size: "L", flowers: 18, price: 20 },
      { size: "XL", flowers: 24, price: 25 },
    ],
  },
];

/**
 * Control On Flowers
 */
export const flowerColumns: DataTableColumn[] = [
  {
    key: "flower",
    label: "Flower",
  },
  {
    key: "price/Stem",
    label: "Price/Stem",
  },
  {
    key: "stock",
    label: "Stock",
  },
  {
    key: "colors",
    label: "Colors",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const initialFlowers: FlowerType[] = [
  {
    id: 1,
    icon: "",
    emoji: "🌹",
    name: "Red Rose",
    price: 12,
    colors: ["#b11e2f", "#7b1320"],
    startingStock: 150,
    lowStockThreshold: 30,
    active: true,
  },
  {
    id: 2,
    icon: "",
    emoji: "🌻",
    name: "Sunflower",
    price: 9,
    colors: ["#f6b700", "#5b3b16"],
    startingStock: 100,
    lowStockThreshold: 20,
    active: true,
  },
];

/**
 * Control On Wrapping
 */
export const wrappingColumns: DataTableColumn[] = [
  {
    key: "wrapping",
    label: "Wrapping",
  },
  {
    key: "price",
    label: "Price",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

export const initialWrappings: WrappingType[] = [
  {
    id: 1,
    icon: "",
    emoji: "🎀",
    name: "Pink Ribbon",
    price: 5,
    active: true,
  },
  {
    id: 2,
    icon: "",
    emoji: "🎀",
    name: "Blue Ribbon",
    price: 5,
    active: true,
  },
];

export const initialRibbons: Ribbon[] = [
  {
    active: true,
    color: "#ff69b4",
    id: 1,
    name: "Pink Ribbon",
    price: 5,
  },
  {
    active: true,
    color: "#cf19b8",
    id: 2,
    name: "Pink Ribbon",
    price: 5,
  },
  {
    active: true,
    color: "#kc19b8",
    id: 3,
    name: "Pink Ribbon",
    price: 5,
  },
];

/**
 * Control On Add-ons
 */
export const addOnsColumns = [
  { label: "Add-on", key: "name" },
  { label: "Price AED", key: "price" },
  { label: "Stock", key: "stock" },
  { label: "Show in Builder", key: "active" },
];
