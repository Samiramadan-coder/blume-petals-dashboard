import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import {
  Role,
  roleFormSchema,
  RoleFormValues,
} from "@/types/role-and-permissions";

import { toast } from "sonner";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import AddButton from "../form/add-button";
import { useTranslations } from "next-intl";
import NormalFormInput from "../form/input";
import NormalFormSelect from "../form/select";
import NormalFormTextarea from "../form/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRole } from "@/lib/role-and-permissions";
import { useForm, SubmitHandler } from "react-hook-form";

export default function CreateNewRole({ roles }: { roles: Role[] }) {
  const tCommon = useTranslations("Common");
  const closeBtn = useRef<HTMLButtonElement>(null);
  const t = useTranslations("RolesAndPermissions");

  const {
    control,
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RoleFormValues>({
    resolver: zodResolver(roleFormSchema(t)),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  const onSubmit: SubmitHandler<RoleFormValues> = async (data) => {
    const result = await createRole(data);

    if (result.success) {
      toast.success(tCommon("CreatedSuccessfully"));
      closeBtn.current?.click();
      return;
    }

    if (result.message) {
      toast.error(result.message);
      return;
    }

    toast.error(tCommon("CreationFailed"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddButton label={t("CreateRole")} />
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-sm"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("CreateRole")}</DialogTitle>
          <DialogDescription>{t("AddNewRoleDescription")}</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <NormalFormInput<RoleFormValues>
            name="name"
            register={register}
            label={t("Fields.Name.Label")}
            placeholder={t("Fields.Name.Placeholder")}
            required
            errors={errors}
          />

          <NormalFormTextarea<RoleFormValues>
            name="description"
            register={register}
            label={t("Fields.Description.Label")}
            placeholder={t("Fields.Description.Placeholder")}
            errors={errors}
          />

          <NormalFormSelect<RoleFormValues>
            name="permissions"
            control={control}
            label={t("Fields.Permissions.Label")}
            placeholder={t("Fields.Permissions.Placeholder")}
            options={roles.map((role) => ({
              label: role.name,
              value: role.permissions,
            }))}
          />
        </form>

        <DialogFooter>
          <DialogClose asChild ref={closeBtn}>
            <Button variant="outline">{tCommon("Cancel")}</Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => void handleSubmit(onSubmit)()}
          >
            {isSubmitting ? <Spinner /> : t("CreateRole")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
