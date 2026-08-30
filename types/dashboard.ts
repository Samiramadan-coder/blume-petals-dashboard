import { Status } from "./orders";

export type Today = {
  active_designs: number;
  orders: number;
  orders_change: number;
  orders_yesterday: number;
  pending_orders: number;
  revenue: string;
  revenue_change_pct: number | null;
  revenue_yesterday: string;
};

export type RevenueSerie = {
  date: string;
  revenue: number;
  orders: number;
};

export type OrdersByChannelType = {
  channels: {
    channel: "mobile_app" | "website";
    orders: number;
    percent: string;
  }[];
  total: number;
};

export type Order = {
  channel: string;
  currency: string;
  customer: string;
  id: number;
  order_number: number;
  payment_status: string;
  placed_at: string;
  status: Status;
  total: string;
  items: {
    name: string;
    qty: number;
  }[];
};
