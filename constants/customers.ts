import { DataTableColumn } from "@/components/reusable/data-table";
import { Customer, CustomerStatus } from "@/types/customers";

export const columns: DataTableColumn[] = [
  { label: "customer" },
  { label: "email" },
  { label: "phone" },
  { label: "orders" },
  { label: "spent (aed)" },
  { label: "last order" },
  { label: "joined" },
  { label: "tags" },
];

export const customersPlaceholder: Customer[] = [
  {
    customer: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    orders: 5,
    spent: 500,
    lastOrder: "2024-06-01",
    joined: "2023-01-01",
    tags: ["VIP", "Returning"],
  },
];

export const customersStatuses: CustomerStatus[] = [
  { label: "All", value: "all" },
  { label: "VIP", value: "vip" },
  { label: "New", value: "new" },
  { label: "Returning", value: "returning" },
  { label: "Inactive", value: "inactive" },
  { label: "Wholesale", value: "wholesale" },
];
