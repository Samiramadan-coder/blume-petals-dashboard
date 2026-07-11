export type Locale = "en" | "ar";

export type T = (key: string) => string;

export type User = {
  email: string;
  email_verified_at: string | null;
  id: number;
  is_admin: boolean;
  is_wholesale: boolean;
  locale: Locale;
  name: string;
  phone: string;
  phone_verified_at: string | null;
  photo_path: string | null;
};
