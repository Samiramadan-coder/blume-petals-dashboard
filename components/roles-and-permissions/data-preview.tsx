"use client";

import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { UsersRound } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { PermissionModule, Role } from "@/types/role-and-permissions";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Catalog from "./modules/catalog";

export default function DataPreview({
  roles,
  modules,
}: {
  roles: Role[];
  modules: PermissionModule[];
}) {
  const [activeRole, setActiveRole] = useState<Role>(roles[0]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
      <Card
        className="border border-primary/20 p-0!"
        style={{ boxShadow: "none" }}
      >
        <CardContent className="p-0!">
          <div className="p-4 border-b border-primary/20">
            <p className="uppercase text-xs text-muted-foreground font-semibold">
              Roles
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
              <div>
                <h3 className="font-semibold text-sm">{role.name}</h3>
                <p className="text-muted-foreground text-xs mt-1">
                  {role.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <UsersRound className="size-4 text-muted-foreground" />
                  <span className="text-muted-foreground text-xs">
                    {role.users_count} Users
                  </span>
                </div>
              </div>

              {role.is_system ? (
                <Badge className="text-[10px] bg-primary/20 text-primary font-semibold">
                  System
                </Badge>
              ) : (
                <Badge className="text-[10px] bg-secondary/20 text-secondary font-semibold">
                  Custom
                </Badge>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="md:col-span-4">
        {modules.map((module) => {
          if (module.key === "catalog") {
            return <Catalog key={module.key} catalog={module} />;
          }
        })}
      </div>
    </div>
  );
}
