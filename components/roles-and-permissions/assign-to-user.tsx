import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "../ui/dialog";

import {
  assignToUserFormSchema,
  AssignToUserFormValues,
  Role,
} from "@/types/role-and-permissions";

import { toast } from "sonner";
import { useRef } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { User } from "@/types/customers";
import AddButton from "../form/add-button";
import { useTranslations } from "next-intl";
import NormalFormSelect from "../form/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { assignRoleToUser } from "@/lib/role-and-permissions";

export default function AssignToUser({
  users,
  roles,
}: {
  users: User[];
  roles: Role[];
}) {
  const tCommon = useTranslations("Common");
  const closeBtn = useRef<HTMLButtonElement>(null);
  const t = useTranslations("RolesAndPermissions");

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<AssignToUserFormValues>({
    resolver: zodResolver(assignToUserFormSchema(t)),
    defaultValues: {
      role_id: 0,
    },
  });

  const onSubmit: SubmitHandler<AssignToUserFormValues> = async (data) => {
    const result = await assignRoleToUser(data.user_id, data.role_id);

    if (result.success) {
      toast.success(tCommon("CreatedSuccessfully"));
      closeBtn.current?.click();
      return;
    }

    toast.error(tCommon("CreationFailed"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <AddButton label={t("AssignToUser")} />
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-sm"
        onInteractOutside={(event) => event.preventDefault()}
      >
        <form
          onSubmit={(e) => void handleSubmit(onSubmit)(e)}
          className="space-y-4"
        >
          <NormalFormSelect<AssignToUserFormValues>
            name="user_id"
            control={control}
            label={t("Fields.User.Label")}
            placeholder={t("Fields.User.Placeholder")}
            options={users.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            required
          />

          <NormalFormSelect<AssignToUserFormValues>
            name="role_id"
            control={control}
            label={t("Fields.Role.Label")}
            placeholder={t("Fields.Role.Placeholder")}
            options={roles.map((role) => ({
              value: role.id,
              label: role.name,
            }))}
            required
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
            {isSubmitting ? <Spinner /> : tCommon("Save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
