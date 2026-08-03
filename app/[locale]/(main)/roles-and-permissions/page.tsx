import { http } from "@/lib/http";
import { PermissionModule, Role } from "@/types/role-and-permissions";
import DataPreview from "@/components/roles-and-permissions/data-preview";

export default async function RolesAndPermissionsPage() {
  const { data: rolesData, ok: ok1 } = await http.get<{
    data: { items: Role[] };
  }>("/api/v1/admin/roles");

  const { data: permissionsData, ok: ok2 } = await http.get<{
    data: { modules: PermissionModule[] };
  }>("/api/v1/admin/permissions");

  if (!ok1 || !ok2) {
    throw new Error("Failed to fetch roles or permissions");
  }

  console.log("RolesAndPermissionsPage data:", permissionsData.data.modules);

  return (
    <main>
      <DataPreview
        roles={rolesData.data.items}
        modules={permissionsData.data.modules}
      />
    </main>
  );
}
