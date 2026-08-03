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

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

export default function CreateEditModule({
  modules,
  role,
}: {
  modules: PermissionModule[];
  role?: Role;
}) {
  const tCommon = useTranslations("Common");
  const t = useTranslations("RolesAndPermissions");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema(t)),
    defaultValues: {
      name: role?.name || "",
      description: role?.description || "",
      permissions: role?.permissions || [],
    },
  });

  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    console.log(data);
  };

  return (
    <form className="md:col-span-4 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="permissions"
        render={({ field }) => {
          const selectedPermissions = field.value || [];

          return (
            <div className="space-y-6">
              {modules.map((module) => {
                return (
                  <div
                    key={module.key}
                    className="border border-primary/20 rounded-lg overflow-hidden"
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

              <FieldError errors={[errors.permissions]} />
            </div>
          );
        }}
      />

      <div className="flex justify-end">
        <Button type="submit" className="h-11 w-32 text-foreground">
          {tCommon("Save")}
        </Button>
      </div>
    </form>
  );
}
