export type StatisticsData = {
  title: string;
  subtitle?: string;
  value: number;
  currency?: string;
  icon: React.ReactNode;
};

export type CustomerStatus = {
  value: "all" | "vip" | "new" | "returning" | "inactive" | "wholesale";
  label: "All" | "VIP" | "New" | "Returning" | "Inactive" | "Wholesale";
};

export type Customer = {
  customer: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrder: string;
  joined: string;
  tags: string[];
};
