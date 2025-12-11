import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

import Select from "react-select";
import { useCreateRoleMutation } from "../../../../app/features/roles/roles";
import { IPermissions, useGetPermissionsQuery } from "../../../../app/features/permissions/permissions";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

export interface IRoleFormInput {
  name: string;
  permissions: string[];
}

export default function AddRole({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [createRole, { isLoading }] = useCreateRoleMutation();
  const { data: permission } = useGetPermissionsQuery();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IRoleFormInput>();

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
      await createRole(formData).unwrap();
      Swal.fire(t("done"), t("role_added_successfully"), "success");
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Swal.fire(t("error"), t("error_while_adding"), "error");
    }
  };

  return (
    <form
      className="flex justify-center flex-col my-12 gap-2 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* اسم الدور */}
      <div>
        <label>{t("role_name")}</label>
        <Input
          type="text"
          {...register("name", {
            required: t("role_name_required") || "اسم الدور مطلوب",
          })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* الصلاحيات */}
      <div className="mb-6">
        <label>{t("select_permissions")}</label>

        <Controller
          name="permissions"
          control={control}
          rules={{
            required: t("permissions_required") || "اختر صلاحيات",
          }}
          render={({ field }) => (
            <Select
              isMulti
              options={options}
              onChange={(val) => field.onChange(val.map((v) => v.value))}
              value={options.filter((opt) => field.value?.includes(opt.value))}
            />
          )}
        />

        {errors.permissions && (
          <p className="text-red-500 text-sm">{errors.permissions.message}</p>
        )}
      </div>

      <Button disabled={isLoading} className="w-full">
        {isLoading ? t("loading_adding") : t("add_role")}
      </Button>
    </form>
  );
}
