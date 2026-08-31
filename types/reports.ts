// Sales Revenue Report
export type TotalType = {
  average_order: string;
  average_order_change_pct: string | null;
  average_order_previous: string;
  orders: number;
  orders_change_pct: string | null;
  orders_placed: number;
  orders_placed_change_pct: string | null;
  orders_placed_previous: number;
  orders_previous: number;
  returning_revenue: string;
  returning_revenue_change_pct: string | null;
  returning_revenue_previous: string;
  revenue: string;
  revenue_change_pct: string | null;
  revenue_previous: string;
};

export type RevenueOverTimeSerie = {
  date: string;
  revenue: number;
  orders: number;
};

export type ByChannel = {
  channel: "website" | "mobile_app";
  orders: number;
  revenue: string;
  share_pct: string;
};

export type ByCategory = {
  category: string;
  orders: number;
  revenue: string;
  share_pct: string;
  slug: string;
  units: number;
};

export type TopProduct = {
  sku: string;
  slug: string;
  name_en: string;
  name_ar: string;
  category: string;
  item_type: string;
  units: number;
  revenue: string;
  share_pct: string;
};

export type ByFulfillment = {
  average: string;
  method: "delivery" | "pickup";
  orders: number;
  revenue: string;
  share_pct: string;
  shipping: string;
};

export type ByEmirate = {
  city_id: number;
  name_en: string;
  name_ar: string;
  orders: number;
  revenue: string;
  share_pct: string;
};

// Customer Stats Report
export type CustomerTotalType = {
  active_customers: number;
  active_customers_change_pct: string | null;
  active_customers_previous: number;
  lifetime_value: string;
  new_customers: number;
  new_customers_change_pct: string | null;
  new_customers_previous: number;
  retention_pct: string;
  retention_pct_previous: string;
  returning_customers: number;
  returning_customers_change_pct: string | null;
  returning_customers_previous: number;
  revenue: string;
  revenue_change_pct: string | null;
  revenue_previous: string;
};

export type CustomerGrowthSerie = {
  date: string;
  new_customers: number;
};

export type NewVsReturningItem = {
  group: "new" | "returning";
  customers: number;
  orders: number;
  revenue: string;
  share_pct: string;
};

export type CustomerByEmirateType = {
  city_id: number;
  customers: number;
  name_ar: string;
  name_en: string;
  share_pct: string;
};

export type TopCustomer = {
  user_id: number;
  name: string;
  email: string;
  orders: number;
  spent: string;
  lifetime_orders: number;
  lifetime_spent: string;
  last_order_at: string | null;
};
