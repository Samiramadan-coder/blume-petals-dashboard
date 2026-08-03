import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Permission,
  PermissionModule,
  Role,
  roleFormSchema,
  RoleFormValues,
} from "@/types/role-and-permissions";

import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, UsersRound } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { createRole } from "@/lib/role-and-permissions";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function EditModule({
  modules,
  role,
}: {
  modules: PermissionModule[];
  role: Role;
}) {
  const locale = useLocale();
  const tCommon = useTranslations("Common");
  const t = useTranslations("RolesAndPermissions");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema(t)),
    defaultValues: {
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    },
  });

  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    const result = await createRole(data, role.id);

    if (result.success) {
      toast.success(tCommon("UpdatedSuccessfully"));
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(tCommon("UpdateFailed"));
  };

  return (
    <form className="md:col-span-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Card className="border border-primary/30" style={{ boxShadow: "none" }}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2
                className={cn(`text-xl font-semibold`, {
                  "font-heading": locale === "en",
                })}
              >
                {role.name}
              </h2>

              {role.is_system ? (
                <>
                  <Lock className="text-muted-foreground size-5" />
                  <Badge className="text-[10px] bg-primary/20 text-primary font-semibold">
                    {t("System")}
                  </Badge>
                </>
              ) : (
                <Badge className="text-[10px] bg-secondary/20 text-secondary font-semibold">
                  {t("Custom")}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <UsersRound className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground text-xs">
                {role.users_count} {t("Users")}
              </span>
            </div>
          </div>
          {role.description && (
            <p className="text-muted-foreground mt-1">{role.description}</p>
          )}
        </CardContent>
      </Card>

      <Controller
        control={control}
        name="permissions"
        render={({ field }) => {
          const selectedPermissions = field.value || [];

          return (
            <div className="space-y-2">
              {modules.map((module) => {
                return (
                  <div
                    key={module.key}
                    className="border border-primary/30 rounded-lg overflow-hidden"
                  >
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-background">
                          <TableHead className="text-sm font-semibold uppercase">
                            {t(
                              module.key.charAt(0).toUpperCase() +
                                module.key.slice(1),
                            )}
                          </TableHead>

                          {module.actions.map((action) => (
                            <TableHead
                              key={action}
                              className="w-16 text-[10px] uppercase"
                            >
                              {t(
                                action.charAt(0).toUpperCase() +
                                  action.slice(1),
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        <TableRow className="h-12 bg-white">
                          <TableCell className="text-xs uppercase text-muted-foreground">
                            {t(
                              module.key.charAt(0).toUpperCase() +
                                module.key.slice(1),
                            )}
                          </TableCell>

                          {module.actions.map((action) => {
                            const permissionKey =
                              `${module.key}.${action}` as Permission;
                            const isChecked =
                              selectedPermissions.includes(permissionKey);

                            return (
                              <TableCell key={action} className="w-16">
                                <Checkbox
                                  aria-label={permissionKey}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...selectedPermissions,
                                        permissionKey,
                                      ]);
                                    } else {
                                      field.onChange(
                                        selectedPermissions.filter(
                                          (perm) => perm !== permissionKey,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          );
        }}
      />

      <div className="flex justify-end">
        <Button type="submit" className="h-11 w-32 text-foreground">
          {isSubmitting ? <Spinner /> : tCommon("Save")}
        </Button>
      </div>
    </form>
  );
}
