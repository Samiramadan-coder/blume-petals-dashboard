import z from "zod";
import { T } from "./shared";

export const orderStatusSchema = (t: T) =>
  z.object({
    status: z.string().min(1, t("StatusIsRequired")),
    note: z.string().optional(),
  });

export type OrderStatus = z.infer<ReturnType<typeof orderStatusSchema>>;

export const AdminNoteSchema = (t: T) =>
  z.object({
    admin_notes: z.string().min(1, t("AdminNoteIsRequired")),
  });

export type AdminNote = z.infer<ReturnType<typeof AdminNoteSchema>>;

export type StatisticsData = {
  title: string;
  subtitle: string;
  value: number;
  currency?: string;
  icon: React.ReactNode;
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
  admin_notes: string | null;
  placed_at: string;
  channel: string;
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
  fulfillment_method: "delivery" | "pickup";
  id: number;
  items: {
    id: number;
    product_variant_id: number;
    name: string;
    name_en: string;
    name_ar: string;
    variant_label: string;
    sku: string;
    unit_price: string;
    qty: number;
    line_total: string;
    message_text: string | null;
    image_url: string;
    slug: string;
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
