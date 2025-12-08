import { useForm, SubmitHandler, Controller } from "react-hook-form";

import Select, { MultiValue } from "react-select";

import { useEffect } from "react";

import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { IAdmins, useUpdateAdminMutation } from "../../../../app/features/Admins/AdminsSlice";

import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useGetRolesQuery } from "../../../../app/features/roles/roles";


export interface IFormInputAdmin {
  name: string;
  username: string;
  email: string;
  password: string;

  roles: string[];

}

// type Option = { label: string; value: string | number };

interface IUpdateAdminProps {
  tempAdmin: IAdmins | undefined;
  onCloseUp: () => void;
}



export default function UpdateAdminForm({ tempAdmin, onCloseUp }: IUpdateAdminProps) {
  const { t } = useTranslation();
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const { data: roles } = useGetRolesQuery();

  const { register, handleSubmit, control, setValue } = useForm<IFormInputAdmin>();

  // const selectedRoles = watch("roles");

  // pre-fill form
  useEffect(() => {
    if (tempAdmin) {
      setValue("name", tempAdmin?.name);
      setValue("username", tempAdmin?.username);
      setValue("email", tempAdmin?.email);
      setValue("roles", tempAdmin?.role);
    }
  }, [tempAdmin, setValue]);






  const onSubmit: SubmitHandler<IFormInputAdmin> = async (data) => {

    try {
      await updateAdmin({
        id: tempAdmin?.id,
        data: {
          name: data.name,
          username: data.username,
          email: data.email,
    
          password: data.password,
       
          roles: data.roles,

        },
      }).unwrap();
      console.log("Final Payload:", data);
      onCloseUp();
      Swal.fire("تم التحديث!", "تم تحديث بيانات المستخدم بنجاح.", "success");
    } catch (error: unknown) {
      const err = error as errorType;
      Swal.fire(
        t("errorTitle") || "خطأ",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : t("errorUnknown") || "حدث خطأ ما",
        "error"
      );
    }
  };

  return (
    <form
      className="grid grid-cols-2 justify-center items-center my-12 gap-2 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label>{t("userName") || "اسم المستخدم"}</label>
        <Input type="text" {...register("name")} />
      </div>
      <div>
        <label>{t("email") || "البريد الالكتروني"}</label>
        <Input type="text" {...register("email")} />
      </div>





      <div>
        <label>
          {t("passwordOptional") ||
            "كلمة المرور (اتركها فارغة إذا لم يتم تغييرها)"}
        </label>
        <Input type="text" {...register("password")} />
      </div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          {t("selectPermissions") || "اختر الصلاحيات:"}
        </label>
        <Controller
          control={control}
          name="roles"
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={roles?.data.map((r) => ({
                value: r.name,
                label: r.name || r.name,
              }))}
              placeholder={t("selectRoles") || "اختر الرولز"}
              onChange={(val: MultiValue<{ value: string; label: string }>) =>
                field.onChange(val.map((v) => v.value))
              }
              value={
                roles?.data
                  ?.map((r) => ({
                    value: r.name,
                    label: r.name || r.name,
                  }))
                  .filter((opt) => field.value?.includes(opt.value))
              }
            />
          )}
        />
      </div>
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? t("loadingBtn") || "انتظر..." : t("updateAdminButton") || "تحديث المدير"}
        </Button>
      </div>
    </form>
  );
}
