import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";

export const columns = (t: T): DataTableColumn[] => [
  {
    label: t("Table.OrderID"),
  },
  {
    label: t("Table.CustomerName"),
  },
  {
    label: t("Table.ItemsCount"),
  },
  {
    label: t("Table.TotalAmount"),
  },
  {
    label: t("Table.FulfillmentStatus"),
  },
  {
    label: t("Table.Status"),
  },
  {
    label: t("Table.OrderDate"),
  },
  {
    label: t("Table.Actions"),
  },
];

export const orderStatuses = (t: T) => [
  {
    label: t("All"),
    value: "all",
  },
  {
    label: t("Pending"),
    value: "pending",
  },
  {
    label: t("Processing"),
    value: "processing",
  },
  {
    label: t("Shipped"),
    value: "shipped",
  },
  {
    label: t("Delivered"),
    value: "delivered",
  },
  {
    label: t("Cancelled"),
    value: "cancelled",
  },
];
