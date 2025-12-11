import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import Select from "react-select";
import {
  IRole,
  useUpdateRoleMutation,
} from "../../../../app/features/roles/roles";
import {
  IPermissions,
  useGetPermissionsQuery,
} from "../../../../app/features/permissions/permissions";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

export interface IRoleFormInput {
  name: string;
  permissions: string[];
}

export default function UpdateRole({
  onClose,
  role,
}: {
  onClose: () => void;
  role: IRole;
}) {
  const { t } = useTranslation();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const { data: permission } = useGetPermissionsQuery();

  const { register, handleSubmit, control } = useForm<IRoleFormInput>({
    defaultValues: {
      name: role.name,
      permissions: role.permissions || [],
    },
  });

  const options =
    permission?.data?.map((p: IPermissions) => ({
      value: p.name,
      label: p.name,
    })) || [];

  const onSubmit: SubmitHandler<IRoleFormInput> = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);

    data.permissions.forEach((p, index) =>
      formData.append(`permissions[${index}]`, p)
    );

    try {
      await updateRole({ id: role.id, formData }).unwrap();
      Swal.fire(t("done"), t("role_updated_successfully"), "success");
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire(t("error"), t("error_while_updating"), "error");
    }
  };

  return (
    <form className="p-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>{t("role_name")}</label>
        <Input
          type="text"
          {...register("name", { required: t("role_name_required") })}
        />
      </div>

      <div>
        <label>{t("select_permissions")}</label>

        <Controller
          name="permissions"
          control={control}
          rules={{ required: t("permissions_required") }}
          render={({ field }) => (
            <Select
              isMulti
              options={options}
              onChange={(val) => field.onChange(val.map((v) => v.value))}
              value={options.filter((opt) => field.value?.includes(opt.value))}
            />
          )}
        />
      </div>

      <Button disabled={isLoading} className="w-full">
        {isLoading ? t("loading_update") : t("update")}
      </Button>
    </form>
  );
}
