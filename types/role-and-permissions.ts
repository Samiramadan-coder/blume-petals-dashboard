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
  | "roles.delete"
  | "notifications.view"
  | "notifications.create"
  | "contact.view"
  | "contact.delete"
  | "settings.view"
  | "settings.edit";

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

type ContactModule = {
  key: "contact";
  actions: Array<"view" | "delete">;
  permissions: Array<"contact.view" | "contact.delete">;
};

type SettingsModule = {
  key: "settings";
  actions: Array<"view" | "edit">;
  permissions: Array<"settings.view" | "settings.edit">;
};

type NotificationsModule = {
  key: "notifications";
  actions: Array<"view" | "create">;
  permissions: Array<"notifications.view" | "notifications.create">;
};

export type PermissionModule =
  | CatalogModule
  | OrdersModule
  | CouponsModule
  | ShippingModule
  | UsersModule
  | ReviewsModule
  | RolesModule
  | NotificationsModule
  | ContactModule
  | SettingsModule;

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
        "notifications.view",
        "notifications.create",
      ]),
    ),
  });

export type RoleFormValues = z.infer<ReturnType<typeof roleFormSchema>>;

export const assignToUserFormSchema = (t: T) =>
  z.object({
    user_id: z.number().min(1, t("Fields.User.Required")),
    role_id: z.number().min(1, t("Fields.Role.Required")),
  });

export type AssignToUserFormValues = z.infer<
  ReturnType<typeof assignToUserFormSchema>
>;
