import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select, { MultiValue } from "react-select";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { useCreateAdminMutation } from "../../../../app/features/Admins/AdminsSlice";
import { useGetRolesQuery } from "../../../../app/features/roles/roles";
import { IFormInputAdmin } from "../updateForm";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

export default function AddAdmin({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const { data: roles } = useGetRolesQuery();
  const { register, handleSubmit, control } = useForm<IFormInputAdmin>();

  const onSubmit: SubmitHandler<IFormInputAdmin> = async (data) => {
    try {
      await createAdmin({
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
        roles: data.roles,
      }).unwrap();

      onClose();
      Swal.fire(
        t("successTitle") || "تمت الإضافة!",
        t("adminAddedSuccess") || "تمت إضافة المستخدم بنجاح.",
        "success"
      );
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
      className="grid grid-cols-2 gap-4 my-12 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label>{t("userName") || "اسم المستخدم"}</label>
        <Input type="text" {...register("name")} />
      </div>

      <div>
        <label>{t("email") || "البريد الإلكتروني"}</label>
        <Input type="text" {...register("email")} />
      </div>

      <div>
        <label>
          {t("password")}
        </label>
        <Input type="text" {...register("password")} />
      </div>

      <div className="mb-6 col-span-2">
        <label className="block mb-2 font-semibold text-gray-700">
          {t("selectRoles") || "اختر الرولز:"}
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
                label: r.name,
              }))}
              placeholder={t("selectRoles") || "اختر الرولز"}
              onChange={(val: MultiValue<{ value: string; label: string }>) =>
                field.onChange(val.map((v) => v.value))
              }
              value={
                roles?.data
                  ?.map((r) => ({ value: r.name, label: r.name }))
                  .filter((opt) => field.value?.includes(opt.value))
              }
            />
          )}
        />
      </div>

      <div className="col-span-2">
        <Button className="w-full" disabled={isCreating}>
          {isCreating
            ? t("loadingBtn") || "انتظر..."
            : t("addAdminButton") || "إضافة مستخدم"}
        </Button>
      </div>
    </form>
  );
}
