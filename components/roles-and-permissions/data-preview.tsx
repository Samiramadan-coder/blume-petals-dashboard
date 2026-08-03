"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { Badge } from "../ui/badge";
import CreateEditModule from "./modules/create-edit";
import { UsersRound } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { PermissionModule, Role } from "@/types/role-and-permissions";
import { useTranslations } from "next-intl";

export default function DataPreview({
  roles,
  modules,
}: {
  roles: Role[];
  modules: PermissionModule[];
}) {
  const t = useTranslations("RolesAndPermissions");
  const [activeRole, setActiveRole] = useState<Role>(roles[0]);

  return (
    <div className="grid items-start grid-cols-1 md:grid-cols-5 gap-6">
      <Card
        className="border border-primary/20 p-0!"
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
                <Badge className="text-[10px] bg-secondary/20 text-secondary font-semibold">
                  {t("Custom")}
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <CreateEditModule
        key={activeRole.id}
        modules={modules}
        role={activeRole}
      />
    </div>
  );
}
