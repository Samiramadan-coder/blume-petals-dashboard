import type { ReactNode } from "react";

export type DashboardNavigationItem =
  | {
      label: string;
      href: string;
      type: "link";
      icon: ReactNode;
      enabled: boolean;
    }
  | {
      label: string;
      type: "label";
      enabled: boolean;
    };

export type DashboardNavigationLinkItem = Extract<
  DashboardNavigationItem,
  { type: "link" }
>;
