import { Order } from "./orders";

type Address = {
  apartment: null | string;
  area: string;
  building: string;
  city: { id: number; name: string; delivery_fee: string };
  country: { id: number; name: string };
  id: number;
  is_default: boolean;
  label: string;
  landmark: string;
  latitude: string;
  longitude: string;
  recipient_name: string;
  recipient_phone: string;
  street: string;
};

type Design = {
  bouquet: {
    product_id: number;
    variant_id: number;
    size: string;
    name: string;
    image_url: string;
  };
  created_at: string;
  id: number;
  image_url: string;
  total_stems: number;
};

type MyOrder = Order & {
  grand_total: string;
};

type WishList = {
  added_at: string;
  id: number;
  image_url: string;
  name: string;
  price_from: string;
  slug: string;
  status: string;
};

export type User = {
  addresses: Address[];
  addresses_count: number;
  designs: Design[];
  designs_count: number;
  orders: MyOrder[];
  wishlist: WishList[];
  wishlist_count: number;
  id: number;
  name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  is_admin: boolean;
  is_blocked: boolean;
  is_wholesale: boolean;
  email_verified: boolean;
  orders_count: number;
  total_spent: string;
  last_order_at: string;
  created_at: string;
};

export type Summary = {
  avg_lifetime_value: string;
  new_this_month: number;
  total_customers: number;
  vip: number;
};
