import { http } from "@/lib/http";
import { PermissionModule, Role } from "@/types/role-and-permissions";
import DataPreview from "@/components/roles-and-permissions/data-preview";
import { User } from "@/types/customers";

export default async function RolesAndPermissionsPage() {
  const { data: rolesData, ok: ok1 } = await http.get<{
    data: { items: Role[] };
  }>("/api/v1/admin/roles", {
    next: {
      revalidate: 60,
      tags: ["roles-and-permissions"],
    },
  });

  const { data: permissionsData, ok: ok2 } = await http.get<{
    data: { modules: PermissionModule[] };
  }>("/api/v1/admin/permissions", {
    next: {
      revalidate: 60,
      tags: ["roles-and-permissions"],
    },
  });

  const { data: customersData, ok: ok3 } = await http.get<{
    data: { items: User[] };
  }>("/api/v1/admin/users", {
    params: {
      page: 1,
      per_page: 1000,
    },
    next: {
      revalidate: 60,
      tags: ["roles-and-permissions"],
    },
  });

  if (!ok1 || !ok2 || !ok3) {
    throw new Error("Failed to fetch roles, permissions, or customers");
  }

  console.log(rolesData);

  return (
    <main>
      <DataPreview
        key={JSON.stringify(rolesData.data.items)}
        roles={rolesData.data.items}
        modules={permissionsData.data.modules}
        users={customersData.data.items}
      />
    </main>
  );
}
