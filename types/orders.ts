import z from "zod";
import { T } from "./shared";

// Admin note schema and types
export const AdminNoteSchema = (t: T) =>
  z.object({
    admin_notes: z.string().min(1, t("AdminNoteIsRequired")),
  });

export type AdminNote = z.infer<ReturnType<typeof AdminNoteSchema>>;

// Order Type
type Address = {
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

type Customer = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
};

type OrderSummary = {
  discount_total: string;
  grand_total: string;
  shipping_total: string;
  subtotal: string;
  vat_rate: string;
  vat_total: string;
};

type Item = {
  id: number;
  image_url: string | null;
  item_type: string;
  line_total: string;
  message_text: string | null;
  name: string;
  name_ar: string;
  name_en: string;
  product_variant_id: number;
  qty: number;
  sku: string;
  slug: string;
  unit_price: string;
  variant_label: string;
};

type Pickup = {
  address: string;
  city_id: number;
  hours: string;
  latitude: string;
  longitude: string;
  name: string;
  ready_in: string;
};

export type Status =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type Order = {
  address: Address | null;
  customer: Customer;
  summary: OrderSummary;
  order_number: number;
  payment_status: string;
  admin_notes: string | null;
  placed_at: string;
  channel: string;
  status: Status;
  status_label: string;
  currency: string;
  customer_notes: string | null;
  fulfillment_method: "delivery" | "pickup";
  id: number;
  items: Item[];
  pickup: Pickup | null;
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
