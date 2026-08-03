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
