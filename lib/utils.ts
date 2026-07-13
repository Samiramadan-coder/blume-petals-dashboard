import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function createQueryStringUrl({
  searchParams,
  pathname,
  key,
  value,
}: {
  searchParams: URLSearchParams | string;
  pathname: string;
  key: string;
  value?: string;
}) {
  const params = new URLSearchParams(searchParams.toString());

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export const normalizeHexColor = (value: string) => {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) return null;

  const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;

  if (/^#[0-9a-f]{3}$/.test(withHash)) {
    return `#${withHash[1]}${withHash[1]}${withHash[2]}${withHash[2]}${withHash[3]}${withHash[3]}`;
  }

  if (/^#[0-9a-f]{6}$/.test(withHash)) {
    return withHash;
  }

  return null;
};

export const createSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/["'’]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
