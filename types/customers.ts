export type User = {
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
