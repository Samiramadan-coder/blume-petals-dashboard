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
