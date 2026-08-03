import z from "zod";
import { T } from "./shared";

export type Permission =
  | "catalog.view"
  | "catalog.create"
  | "catalog.edit"
  | "catalog.delete"
  | "orders.view"
  | "orders.edit"
  | "coupons.view"
  | "coupons.create"
  | "coupons.edit"
  | "coupons.delete"
  | "shipping.view"
  | "shipping.create"
  | "shipping.edit"
  | "shipping.delete"
  | "users.view"
  | "reviews.view"
  | "reviews.delete"
  | "roles.view"
  | "roles.create"
  | "roles.edit"
  | "roles.delete";

export type Role = {
  description: string;
  id: number;
  is_system: boolean;
  name: string;
  permissions: Permission[];
  users_count: number;
};

type CatalogModule = {
  key: "catalog";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "catalog.view" | "catalog.create" | "catalog.edit" | "catalog.delete"
  >;
};

type OrdersModule = {
  key: "orders";
  actions: Array<"view" | "edit">;
  permissions: Array<"orders.view" | "orders.edit">;
};

type CouponsModule = {
  key: "coupons";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "coupons.view" | "coupons.create" | "coupons.edit" | "coupons.delete"
  >;
};

type ShippingModule = {
  key: "shipping";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "shipping.view" | "shipping.create" | "shipping.edit" | "shipping.delete"
  >;
};

type UsersModule = {
  key: "users";
  actions: Array<"view">;
  permissions: Array<"users.view">;
};

type ReviewsModule = {
  key: "reviews";
  actions: Array<"view" | "delete">;
  permissions: Array<"reviews.view" | "reviews.delete">;
};

type RolesModule = {
  key: "roles";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "roles.view" | "roles.create" | "roles.edit" | "roles.delete"
  >;
};

export type PermissionModule =
  | CatalogModule
  | OrdersModule
  | CouponsModule
  | ShippingModule
  | UsersModule
  | ReviewsModule
  | RolesModule;

// Create And Edit Role Form
export const roleFormSchema = (t: T) =>
  z.object({
    name: z
      .string()
      .min(1, t("Fields.Name.Required"))
      .min(3, t("Fields.Name.MinLength")),
    description: z.string(),
    permissions: z.array(
      z.enum([
        "catalog.view",
        "catalog.create",
        "catalog.edit",
        "catalog.delete",
        "orders.view",
        "orders.edit",
        "coupons.view",
        "coupons.create",
        "coupons.edit",
        "coupons.delete",
        "shipping.view",
        "shipping.create",
        "shipping.edit",
        "shipping.delete",
        "users.view",
        "reviews.view",
        "reviews.delete",
        "roles.view",
        "roles.create",
        "roles.edit",
        "roles.delete",
      ]),
    ),
  });

export type RoleFormValues = z.infer<ReturnType<typeof roleFormSchema>>;
