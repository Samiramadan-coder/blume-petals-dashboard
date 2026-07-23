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
  address: {
    apartment: string | null;
    area: string;
    building: string;
    city: string;
    country: string;
    delivery_fee: string;
    landmark: string;
    latitude: string;
    longitude: string;
    recipient_name: string;
    recipient_phone: string;
    street: string;
  };
  customer: {
    email: string;
    id: number;
    name: string;
    phone: string | null;
  };
  summary: {
    discount_total: string;
    grand_total: string;
    shipping_total: string;
    subtotal: string;
    vat_rate: string;
    vat_total: string;
  };
  order_number: number;
  payment_status: string;
  placed_at: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "pickup"
    | "cancelled";
  status_label:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Pickup"
    | "Cancelled";
  currency: string;
  customer_notes: string | null;
  fulfillment_method: string;
  id: number;
  items: {
    id: number;
    line_total: string;
    message_text: string | null;
    name: string;
    qty: number;
  }[];
};

export type Summary = {
  cancelled: number;
  delivered: number;
  pending: number;
  processing: number;
  revenue: string;
  shipped: number;
  total: number;
};
