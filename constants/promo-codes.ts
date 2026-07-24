import { DataTableColumn } from "@/components/reusable/data-table";
import { T } from "@/types/shared";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.Code"),
  },
  {
    label: t("Table.Discount"),
  },
  {
    label: t("Table.Usage"),
  },
  {
    label: t("Table.ValidDates"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.Actions"),
  },
];

export const promoCodeStatuses = (t: T) => [
  {
    value: "all",
    label: t("Statuses.All"),
  },
  {
    value: "active",
    label: t("Statuses.Active"),
  },
  {
    value: "scheduled",
    label: t("Statuses.Scheduled"),
  },
  {
    value: "expired",
    label: t("Statuses.Expired"),
  },
  {
    value: "inactive",
    label: t("Statuses.Inactive"),
  },
];
