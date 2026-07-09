import { Order, OrderStatus } from "@/types/orders";
import { DataTableColumn } from "@/components/reusable/data-table";

export const columns: DataTableColumn[] = [
  { label: "order" },
  { label: "customer" },
  { label: "items" },
  { label: "total (aed)" },
  { label: "fulfillment" },
  { label: "status" },
  { label: "date" },
  { label: "actions" },
];

export const ordersPlaceholder: Order[] = [
  {
    order: "",
    customer: "",
    items: 0,
    total: 0,
    fulfillment: "",
    status: "",
    date: "",
  },
];

export const orderStatuses: OrderStatus[] = [
  {
    label: "All",
    value: "all",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Processing",
    value: "processing",
  },
  {
    label: "Shipped",
    value: "shipped",
  },
  {
    label: "Delivered",
    value: "delivered",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
];
