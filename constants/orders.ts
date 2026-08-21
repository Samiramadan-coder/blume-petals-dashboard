import { T } from "@/types/shared";
import { DataTableColumn } from "@/components/reusable/data-table";
import { Order } from "@/types/orders";

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

export const orderStatuses = (
  t: T,
): {
  label: string;
  value: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}[] => [
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

export const statusColorClasses: Record<Order["status"], string> = {
  pending: "bg-amber-100 text-amber-800",
  processing: "bg-sky-100 text-sky-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-emerald-100 text-emerald-800",
  pickup: "bg-violet-100 text-violet-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export const bulletsClasses: Record<Order["status"], string> = {
  pending: "bg-amber-400",
  processing: "bg-sky-400",
  shipped: "bg-indigo-400",
  delivered: "bg-emerald-400",
  pickup: "bg-violet-400",
  cancelled: "bg-rose-400",
};

export const labelClasses: Record<Order["status"], string> = {
  pending: "text-amber-400",
  processing: "text-sky-400",
  shipped: "text-indigo-400",
  delivered: "text-emerald-400",
  pickup: "text-violet-400",
  cancelled: "text-rose-400",
};
