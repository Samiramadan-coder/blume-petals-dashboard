import {
  Box,
  Bell,
  Mail,
  Tags,
  Globe,
  Store,
  Truck,
  Ticket,
  // UserCog,
  Flower2,
  LayoutGrid,
  UsersRound,
  ShieldCheck,
  ShoppingCart,
  CalendarDays,
  MessageSquare,
  SlidersVertical,
  ChartNoAxesColumn,
} from "lucide-react";
import { createElement } from "react";
import { Permission } from "@/types/role-and-permissions";
import type { DashboardNavigationItem } from "@/types/dashboard-layout";

export const navigation = (
  permissions: Permission[],
): DashboardNavigationItem[] => [
  {
    label: "sidebar.navigation.overview",
    type: "label",
    enabled: true,
  },
  {
    label: "sidebar.navigation.dashboard",
    href: "/",
    type: "link",
    icon: createElement(LayoutGrid, { className: "h-4 w-4" }),
    enabled: true,
  },
  {
    label: "sidebar.navigation.catalog",
    type: "label",
    enabled: true,
  },
  {
    label: "sidebar.navigation.products",
    href: "/products",
    type: "link",
    icon: createElement(Box, { className: "h-4 w-4" }),
    enabled: permissions.includes("catalog.view"),
  },
  {
    label: "sidebar.navigation.categories",
    href: "/categories",
    type: "link",
    icon: createElement(Tags, { className: "h-4 w-4" }),
    enabled: permissions.includes("catalog.view"),
  },
  {
    label: "sidebar.navigation.flower",
    href: "/flowers",
    type: "link",
    icon: createElement(Flower2, { className: "h-4 w-4" }),
    enabled: permissions.includes("catalog.view"),
  },
  {
    label: "sidebar.navigation.customBuilder",
    href: "/templates",
    type: "link",
    icon: createElement(SlidersVertical, { className: "h-4 w-4" }),
    enabled: permissions.includes("catalog.view"),
  },
  {
    label: "sidebar.navigation.sales",
    type: "label",
    enabled: true,
  },
  {
    label: "sidebar.navigation.orders",
    href: "/orders",
    type: "link",
    icon: createElement(ShoppingCart, { className: "h-4 w-4" }),
    enabled: permissions.includes("orders.view"),
  },
  {
    label: "sidebar.navigation.customers",
    href: "/customers",
    type: "link",
    icon: createElement(UsersRound, { className: "h-4 w-4" }),
    enabled: permissions.includes("users.view"),
  },
  {
    label: "sidebar.navigation.reviews",
    href: "/reviews",
    type: "link",
    icon: createElement(MessageSquare, { className: "h-4 w-4" }),
    enabled: permissions.includes("reviews.view"),
  },
  {
    label: "sidebar.navigation.reports",
    href: "/reports",
    type: "link",
    icon: createElement(ChartNoAxesColumn, { className: "h-4 w-4" }),
    enabled: true,
  },
  {
    label: "sidebar.navigation.marketing",
    type: "label",
    enabled: true,
  },
  {
    label: "sidebar.navigation.promoCodes",
    href: "/promo-codes",
    type: "link",
    icon: createElement(Ticket, { className: "h-4 w-4" }),
    enabled: permissions.includes("coupons.view"),
  },
  {
    label: "sidebar.navigation.occasionsCollections",
    href: "/occasions",
    type: "link",
    icon: createElement(CalendarDays, { className: "h-4 w-4" }),
    enabled: permissions.includes("catalog.view"),
  },
  {
    label: "sidebar.navigation.settings",
    type: "label",
    enabled: true,
  },
  {
    label: "sidebar.navigation.countriesCities",
    href: "/countries-cities",
    type: "link",
    icon: createElement(Globe, { className: "h-4 w-4" }),
    enabled: true,
  },
  {
    label: "sidebar.navigation.storeSettings",
    href: "/store-settings",
    type: "link",
    icon: createElement(Store, { className: "h-4 w-4" }),
    enabled: permissions.includes("settings.view"),
  },
  {
    label: "sidebar.navigation.messages",
    href: "/messages",
    type: "link",
    icon: createElement(Mail, { className: "h-4 w-4" }),
    enabled: permissions.includes("contact.view"),
  },
  {
    label: "sidebar.navigation.deliveryPickup",
    href: "/delivery-pickup",
    type: "link",
    icon: createElement(Truck, { className: "h-4 w-4" }),
    enabled: true,
  },
  {
    label: "sidebar.navigation.notifications",
    href: "/notifications",
    type: "link",
    icon: createElement(Bell, { className: "h-4 w-4" }),
    enabled: permissions.includes("notifications.view"),
  },
  {
    label: "sidebar.navigation.rolesAndPermissions",
    href: "/roles-and-permissions",
    type: "link",
    icon: createElement(ShieldCheck, { className: "h-4 w-4" }),
    enabled: permissions.includes("roles.view"),
  },
  // {
  //   label: "sidebar.navigation.adminAccount",
  //   href: "/admin-account",
  //   type: "link",
  //   icon: createElement(UserCog, { className: "h-4 w-4" }),
  //   enabled: true,
  // },
];

export const navigationLabels = () =>
  [
    {
      label: "sidebar.navigation.dashboard",
      href: "/",
    },

    {
      label: "sidebar.navigation.products",
      href: "/products",
    },
    {
      label: "sidebar.navigation.categories",
      href: "/categories",
    },
    {
      label: "sidebar.navigation.flower",
      href: "/flowers",
    },
    {
      label: "sidebar.navigation.customBuilder",
      href: "/templates",
    },

    {
      label: "sidebar.navigation.orders",
      href: "/orders",
    },
    {
      label: "sidebar.navigation.customers",
      href: "/customers",
    },
    {
      label: "sidebar.navigation.reviews",
      href: "/reviews",
    },
    {
      label: "sidebar.navigation.reports",
      href: "/reports",
    },

    {
      label: "sidebar.navigation.promoCodes",
      href: "/promo-codes",
    },
    {
      label: "sidebar.navigation.occasionsCollections",
      href: "/occasions",
    },

    {
      label: "sidebar.navigation.countriesCities",
      href: "/countries-cities",
    },
    {
      label: "sidebar.navigation.storeSettings",
      href: "/store-settings",
    },
    {
      label: "sidebar.navigation.messages",
      href: "/messages",
    },
    {
      label: "sidebar.navigation.deliveryPickup",
      href: "/delivery-pickup",
    },
    {
      label: "sidebar.navigation.notifications",
      href: "/notifications",
    },
    {
      label: "sidebar.navigation.rolesAndPermissions",
      href: "/roles-and-permissions",
    },
  ] as const;
