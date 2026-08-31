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
