import type { ReactNode } from "react";

export type DashboardNavigationItem =
  | {
      label: string;
      href: string;
      type: "link";
      icon: ReactNode;
    }
  | {
      label: string;
      type: "label";
    };

export type DashboardNavigationLinkItem = Extract<
  DashboardNavigationItem,
  { type: "link" }
>;
