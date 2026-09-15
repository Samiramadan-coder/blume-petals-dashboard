"use server";

import { updateTag } from "next/cache";
import { ForbiddenError, http, ServerError } from "./http";
import { RoleFormValues } from "@/types/role-and-permissions";

// Create Or Edit Role Form
type RoleResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message?: string;
    };

export async function createRole(
  role: RoleFormValues,
  roleId?: number,
): Promise<RoleResponse> {
  const url = roleId ? `/api/v1/admin/roles/${roleId}` : "/api/v1/admin/roles";
  const method = roleId ? "put" : "post";

  try {
    const { data } = await http[method]<{ message: string }>(url, role);
    updateTag("roles-and-permissions");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error creating role:", error);

    if (error instanceof ForbiddenError) {
      return { success: false, message: error.message };
    }

    if (error instanceof ServerError) {
      return { success: false, message: error.message };
    }

    return { success: false };
  }
}

// Delete Role
type DeleteRoleResponse =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function deleteRole(roleId: number): Promise<DeleteRoleResponse> {
  try {
    const { data } = await http.delete<{ message: string }>(
      `/api/v1/admin/roles/${roleId}`,
    );
    updateTag("roles-and-permissions");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error deleting role:", error);

    if (error instanceof ForbiddenError) {
      return { success: false, message: error.message };
    }

    if (error instanceof ServerError) {
      return { success: false, message: error.message };
    }

    return { success: false };
  }
}

// Assign Role to User
type AssignRoleToUserResponse =
  | { success: true; message: string }
  | { success: false; message?: string };

export async function assignRoleToUser(
  userId: number,
  roleId: number,
): Promise<AssignRoleToUserResponse> {
  try {
    const { data } = await http.put<{ message: string }>(
      `/api/v1/admin/users/${userId}/role`,
      {
        role_id: roleId,
      },
    );
    updateTag("roles-and-permissions");
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error assigning role to user:", error);

    if (error instanceof ForbiddenError) {
      return { success: false, message: error.message };
    }

    if (error instanceof ServerError) {
      return { success: false, message: error.message };
    }
    return { success: false };
  }
}
