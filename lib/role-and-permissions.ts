"use server";

import { updateTag } from "next/cache";
import { http } from "./http";
import { RoleFormValues } from "@/types/role-and-permissions";

// Create Or Edit Role Form
type RoleResponse = { success: boolean };

export async function createRole(
  role: RoleFormValues,
  roleId?: number,
): Promise<RoleResponse> {
  const url = roleId ? `/api/v1/admin/roles/${roleId}` : "/api/v1/admin/roles";
  const method = roleId ? "put" : "post";

  try {
    await http[method](url, role);
    updateTag("roles-and-permissions");
    return { success: true };
  } catch (error) {
    console.error("Error creating role:", error);
    return { success: false };
  }
}

// Delete Role
type DeleteRoleResponse = { success: boolean };

export async function deleteRole(roleId: number): Promise<DeleteRoleResponse> {
  try {
    await http.delete(`/api/v1/admin/roles/${roleId}`);
    updateTag("roles-and-permissions");
    return { success: true };
  } catch (error) {
    console.error("Error deleting role:", error);
    return { success: false };
  }
}

// Assign Role to User
type AssignRoleToUserResponse = { success: boolean };

export async function assignRoleToUser(
  userId: number,
  roleId: number,
): Promise<AssignRoleToUserResponse> {
  try {
    await http.put(`/api/v1/admin/users/${userId}/role`, { role_id: roleId });
    updateTag("roles-and-permissions");
    return { success: true };
  } catch (error) {
    console.error("Error assigning role to user:", error);
    return { success: false };
  }
}
