"use client";

import {
  useMemo,
  useContext,
  useCallback,
  useTransition,
  createContext,
  type ReactNode,
} from "react";
import type { User } from "@/types/shared";
import { useRouter } from "next/navigation";
import type { Permission } from "@/types/role-and-permissions";

type PermissionsContextValue = {
  user: User;
  permissions: Permission[];
  can: (permission: Permission) => boolean;
  canAny: (permissions: readonly Permission[]) => boolean;
  canAll: (permissions: readonly Permission[]) => boolean;
  refreshPermissions: () => void;
  isRefreshing: boolean;
};

const PermissionsContext = createContext<PermissionsContextValue | null>(null);

type PermissionsProviderProps = {
  user: User;
  children: ReactNode;
};

export function PermissionsProvider({
  user,
  children,
}: PermissionsProviderProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();
  const permissions = user.permissions;

  const permissionSet = useMemo(
    () => new Set<Permission>(permissions),
    [permissions],
  );

  const can = useCallback(
    (permission: Permission) => {
      return permissionSet.has(permission);
    },
    [permissionSet],
  );

  const canAny = useCallback(
    (requiredPermissions: readonly Permission[]) => {
      return requiredPermissions.some((permission) =>
        permissionSet.has(permission),
      );
    },
    [permissionSet],
  );

  const canAll = useCallback(
    (requiredPermissions: readonly Permission[]) => {
      return requiredPermissions.every((permission) =>
        permissionSet.has(permission),
      );
    },
    [permissionSet],
  );

  const refreshPermissions = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      permissions,
      can,
      canAny,
      canAll,
      refreshPermissions,
      isRefreshing,
    }),
    [user, permissions, can, canAny, canAll, refreshPermissions, isRefreshing],
  );

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);

  if (!context) {
    throw new Error("usePermissions must be used inside PermissionsProvider");
  }

  return context;
}
