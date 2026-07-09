export type StatisticsData = {
  title: string;
  subtitle: string;
  value: number;
  currency?: string;
  icon: React.ReactNode;
};

export type OrderStatus = {
  value:
    | "all"
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  label:
    | "All"
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Cancelled";
};

export type Order = {
  order: string;
  customer: string;
  items: number;
  total: number;
  fulfillment: string;
  status: string;
  date: string;
};
