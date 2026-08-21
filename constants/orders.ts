import { T } from "@/types/shared";
import { Order, Status } from "@/types/orders";
import { DataTableColumn } from "@/components/reusable/data-table";

export const columns = (t: T): DataTableColumn[] => [
  { label: t("Table.OrderID") },
  { label: t("Table.CustomerName") },
  { label: t("Table.ItemsCount") },
  { label: t("Table.TotalAmount") },
  { label: t("Table.FulfillmentStatus") },
  { label: t("Table.Status") },
  { label: t("Table.OrderDate") },
  { label: t("Table.Actions") },
];

export const orderStatuses = (
  t: T,
): {
  label: string;
  value: Status;
}[] => [
  { label: t("Pending"), value: "pending" },
  { label: t("Processing"), value: "processing" },
  { label: t("Shipped"), value: "shipped" },
  { label: t("Delivered"), value: "delivered" },
  { label: t("Cancelled"), value: "cancelled" },
];

export const statusColorClasses: Record<Order["status"], string> = {
  pending: "bg-[#ed80741f] text-[#b94040]",
  processing: "bg-primary/20 text-primary",
  shipped: "bg-[#7d947b24] text-[#3c6b39]",
  delivered: "bg-secondary/20 text-secondary",
  cancelled: "bg-[#78716c1f] text-[#78716c]",
};

export const bulletsClasses: Record<Order["status"], string> = {
  pending: "bg-[#b94040]",
  processing: "bg-primary",
  shipped: "bg-[#3c6b39]",
  delivered: "bg-secondary",
  cancelled: "bg-[#78716c]",
};

export const labelClasses: Record<Order["status"], string> = {
  pending: "text-[#b94040]",
  processing: "text-primary",
  shipped: "text-[#3c6b39]",
  delivered: "text-secondary",
  cancelled: "text-[#78716c]",
};
