type Permission =
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

// Permission modules and their actions
export type CatalogModule = {
  key: "catalog";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "catalog.view" | "catalog.create" | "catalog.edit" | "catalog.delete"
  >;
};

export type OrdersModule = {
  key: "orders";
  actions: Array<"view" | "edit">;
  permissions: Array<"orders.view" | "orders.edit">;
};

export type CouponsModule = {
  key: "coupons";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "coupons.view" | "coupons.create" | "coupons.edit" | "coupons.delete"
  >;
};

export type ShippingModule = {
  key: "shipping";
  actions: Array<"view" | "create" | "edit" | "delete">;
  permissions: Array<
    "shipping.view" | "shipping.create" | "shipping.edit" | "shipping.delete"
  >;
};

export type UsersModule = {
  key: "users";
  actions: Array<"view">;
  permissions: Array<"users.view">;
};

export type ReviewsModule = {
  key: "reviews";
  actions: Array<"view" | "delete">;
  permissions: Array<"reviews.view" | "reviews.delete">;
};

export type RolesModule = {
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

// export type PermissionsResponse = {
//   modules: PermissionModule[];
// };
