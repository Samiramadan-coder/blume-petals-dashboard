import {
  LayoutGrid,
  FolderKanban,
  Layers2,
  Columns3Cog,
  ShoppingCart,
  CircleUser,
  MessageSquare,
  ChartNoAxesColumn,
  Container,
  Boxes,
  Settings,
  PackageCheck,
  Bell,
  UserStar,
} from "lucide-react";
import { createElement } from "react";
import type { DashboardNavigationItem } from "@/types/dashboard-layout";

export const navigation: DashboardNavigationItem[] = [
  {
    label: "sidebar.navigation.overview",
    type: "label",
  },
  {
    label: "sidebar.navigation.dashboard",
    href: "/",
    type: "link",
    icon: createElement(LayoutGrid, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.catalog",
    type: "label",
  },
  {
    label: "sidebar.navigation.products",
    href: "/products",
    type: "link",
    icon: createElement(FolderKanban, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.categories",
    href: "/categories",
    type: "link",
    icon: createElement(Layers2, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.customBuilder",
    href: "/custom-builder",
    type: "link",
    icon: createElement(Columns3Cog, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.sales",
    type: "label",
  },
  {
    label: "sidebar.navigation.orders",
    href: "/orders",
    type: "link",
    icon: createElement(ShoppingCart, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.customers",
    href: "/customers",
    type: "link",
    icon: createElement(CircleUser, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.reviews",
    href: "/reviews",
    type: "link",
    icon: createElement(MessageSquare, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.reports",
    href: "/reports",
    type: "link",
    icon: createElement(ChartNoAxesColumn, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.marketing",
    type: "label",
  },
  {
    label: "sidebar.navigation.promoCodes",
    href: "/promo-codes",
    type: "link",
    icon: createElement(Container, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.occasionsCollections",
    href: "/occasions-collections",
    type: "link",
    icon: createElement(Boxes, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.settings",
    type: "label",
  },
  {
    label: "sidebar.navigation.storeSettings",
    href: "/store-settings",
    type: "link",
    icon: createElement(Settings, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.deliveryPickup",
    href: "/delivery-pickup",
    type: "link",
    icon: createElement(PackageCheck, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.notifications",
    href: "/notifications",
    type: "link",
    icon: createElement(Bell, { className: "h-4 w-4" }),
  },
  {
    label: "sidebar.navigation.adminAccount",
    href: "/admin-account",
    type: "link",
    icon: createElement(UserStar, { className: "h-4 w-4" }),
  },
];
