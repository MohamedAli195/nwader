import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { IRole, useUpdateRoleMutation } from "../../../app/features/roles/roles";
import {
  IPermissions,
  useGetPermissionsQuery,
} from "../../../app/features/permissions/permissions";

import Select from "react-select";

export interface IRoleFormInput {
  name: string;
  permissions: string[];
}

export default function UpdateRole({
  onClose,
  role,
}: {
  onClose: () => void;
  role: IRole
}) {
  const { t } = useTranslation();
  const [updateRole, { isLoading }] = useUpdateRoleMutation();
  const { data: permission } = useGetPermissionsQuery();

  const { register, handleSubmit, control } = useForm<IRoleFormInput>({
  defaultValues: {
    name: role.name,
    permissions: role.permissions?.map((p: IPermissions) => p.name) || [],
  },
});

  const options =
    permission?.data?.map((p: IPermissions) => ({
      value: p.name,
      label: p.display_name,
    })) || [];

const onSubmit: SubmitHandler<IRoleFormInput> = async (data) => {
  const formData = new FormData();
  // formData.append("_method", "PUT"); // لو Laravel
  formData.append("name", data.name);

  data.permissions.forEach((p, index) =>
    formData.append(`permissions[${index}]`, p)
  );

  try {
    await updateRole({ id: role.id, formData }).unwrap(); // هنا صح
    Swal.fire("تم", "تم تعديل الرول بنجاح", "success");
    onClose();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    Swal.fire("خطأ", "حدث خطأ أثناء التعديل", "error");
  }
};


  return (
    <form className="p-5 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>{"اسم الدور"}</label>
        <Input
          type="text"
          {...register("name", { required: "اسم الدور مطلوب" })}
        />
      </div>

      <div>
        <label>{t("selectPermissions") || "اختر الصلاحيات:"}</label>

        <Controller
          name="permissions"
          control={control}
          rules={{ required: "اختر صلاحيات" }}
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
        {isLoading ? "جاري التعديل..." : "تعديل"}
      </Button>
    </form>
  );
}
