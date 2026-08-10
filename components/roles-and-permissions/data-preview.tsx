"use client";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "../ui/badge";
import EditModule from "./edit-module";
import { User } from "@/types/customers";
import { UsersRound } from "lucide-react";
import AssignToUser from "./assign-to-user";
import { useTranslations } from "next-intl";
import CreateNewRole from "./create-new-role";
import { Card, CardContent } from "../ui/card";
import DeleteBtn from "../reusable/delete-btn";
import ModuleHeader from "../reusable/module-header";
import { deleteRole } from "@/lib/role-and-permissions";
import { usePermissions } from "@/providers/permission-providers";
import { PermissionModule, Role } from "@/types/role-and-permissions";

export default function DataPreview({
  roles,
  modules,
  users,
}: {
  roles: Role[];
  modules: PermissionModule[];
  users: User[];
}) {
  const { can } = usePermissions();
  const tCommon = useTranslations("Common");
  const t = useTranslations("RolesAndPermissions");
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [activeRole, setActiveRole] = useState<Role>(roles[0]);

  return (
    <div className="grid items-start grid-cols-1 md:grid-cols-5 gap-6">
      <div className="md:col-span-5">
        <ModuleHeader
          title={t("RolesAndPermissions")}
          description={t("RolesAndPermissionsDescription")}
        >
          {can("roles.create") && (
            <div className="flex items-center gap-2">
              <AssignToUser users={users} roles={roles} />
              <CreateNewRole roles={roles} />
            </div>
          )}
        </ModuleHeader>
      </div>

      <Card
        className="border border-primary/30 p-0!"
        style={{ boxShadow: "none" }}
      >
        <CardContent className="p-0!">
          <div className="p-4 border-b border-primary/20">
            <p className="uppercase text-xs text-muted-foreground font-semibold">
              {t("Roles")}
            </p>
          </div>
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => setActiveRole(role)}
              className={cn(
                `flex items-start gap-2 p-4 border-b border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors`,
                activeRole.id === role.id &&
                  "bg-primary/10 border-s-2 border-s-primary",
              )}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{role.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">
                  {role.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <UsersRound className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {role.users_count} {t("Users")}
                  </span>
                </div>
              </div>

              {role.is_system ? (
                <Badge className="text-[10px] bg-primary/20 text-primary font-semibold">
                  {t("System")}
                </Badge>
              ) : (
                <div className="flex items-center gap-1">
                  <Badge className="text-[10px] bg-secondary/20 text-secondary font-semibold">
                    {t("Custom")}
                  </Badge>
                  {can("roles.delete") && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <DeleteBtn
                        onDelete={async () => {
                          setLoadingDelete(true);
                          const result = await deleteRole(role.id);
                          setLoadingDelete(false);

                          if (result.success) {
                            toast.success(tCommon("DeletedSuccessfully"));
                            setActiveRole(roles[0]);
                            return;
                          }

                          if (result.message) {
                            toast.error(result.message);
                            return;
                          }

                          toast.error(tCommon("DeleteFailed"));
                        }}
                        loading={loadingDelete}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <EditModule key={activeRole.id} modules={modules} role={activeRole} />
    </div>
  );
}
