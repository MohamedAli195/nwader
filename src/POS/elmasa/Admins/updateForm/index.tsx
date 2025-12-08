import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import Select, { MultiValue } from "react-select";
import { useGetStoresQuery } from "../../../app/features/stores/stores";
import { useEffect } from "react";
import { IAdmins, useUpdateAdminMutation } from "../../../app/features/Admins/AdminsSlice";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { errorType } from "../../../types";
import { useGetRolesQuery } from "../../../app/features/roles/roles";

export interface IFormInputStore {
  name: string;
  email: string;
  password: string;
  store_id: string;
  phone: string;
  roles: string[];
  base_salary: string;
  hourly_rate: string;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
}

type Option = { label: string; value: string | number };

interface IUpdateAdminProps {
  tempAdmin: IAdmins | undefined;
  onCloseUp: () => void;
}

const days = [
  "saturday",
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
];

export default function UpdateAdminForm({ tempAdmin, onCloseUp }: IUpdateAdminProps) {
  const { t } = useTranslation();
  const [updateAdmin, { isLoading }] = useUpdateAdminMutation();
  const { data: stores } = useGetStoresQuery({ search: "", page: 1 });
  const { data: roles } = useGetRolesQuery();

  const { register, handleSubmit, control, setValue } = useForm<IFormInputStore>();

  // const selectedRoles = watch("roles");

  // pre-fill form
  useEffect(() => {
    if (tempAdmin) {
      setValue("name", tempAdmin?.name);
      setValue("email", tempAdmin?.email);
      setValue("phone", tempAdmin?.phone);
      setValue("store_id", tempAdmin?.store?.id?.toString() || "");
      setValue("roles", tempAdmin?.role);
      setValue("base_salary", tempAdmin?.base_salary?.toString() || "");
      setValue("hourly_rate", tempAdmin?.hourly_rate?.toString() || "");
      setValue("work_start_time", formatTime(tempAdmin?.work_start_time || "09:00"));
      setValue("work_end_time", formatTime(tempAdmin?.work_end_time || "17:00"));
      setValue("work_days", tempAdmin?.work_days || []);
    }
  }, [tempAdmin, setValue]);

  const storeOptions: Option[] =
    stores?.data?.data?.map((store) => ({
      value: store.id?.toString() || "",
      label: store.name,
    })) || [];

  const dayOptions: { value: string; label: string }[] = days.map((day) => ({
    value: day,
    label: t(day) || day,
  }));

  const formatTime = (time: string | null | undefined) => {
    if (!time) return "00:00";
    const [hour, minute] = time.split(":");
    return `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;
  };

  const onSubmit: SubmitHandler<IFormInputStore> = async (data) => {
    if (data.work_end_time <= data.work_start_time) {
      Swal.fire(
        "خطأ في الأوقات",
        "وقت نهاية العمل يجب أن يكون بعد وقت البداية.",
        "error"
      );
      return;
    }
    try {
      await updateAdmin({
        id: tempAdmin?.id,
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
          store_id: data.store_id,
          roles: data.roles,
          base_salary: Number(data.base_salary) || 0,
          hourly_rate: Number(data.hourly_rate) || 0,
          work_start_time: formatTime(data.work_start_time),
          work_end_time: formatTime(data.work_end_time),
          work_days: data.work_days,
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
        <label>{t("phone") || "رقم المحمول"}</label>
        <Input type="text" {...register("phone")} />
      </div>
      <div>
        <label>{t("baseSalary") || "الراتب الأساسي"}</label>
        <Input type="number" {...register("base_salary")} />
      </div>
      <div>
        <label>{t("hourlyRate") || "الأجر بالساعة"}</label>
        <Input type="number" {...register("hourly_rate")} />
      </div>
      <div className="flex gap-2">
        <div className="flex-1">
          <label>{t("workStartTime") || "بداية العمل"}</label>
          <Input type="time" {...register("work_start_time")} />
        </div>
        <div className="flex-1">
          <label>{t("workEndTime") || "نهاية العمل"}</label>
          <Input type="time" {...register("work_end_time")} />
        </div>
      </div>
      <div className="mb-6">
        <label>{t("workDays") || "أيام العمل"}</label>
        <Controller
          control={control}
          name="work_days"
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={dayOptions}
              placeholder={t("selectWorkDays") || "اختر أيام العمل"}
              onChange={(val: MultiValue<Option>) =>
                field.onChange(val.map((v) => v.value))
              }
              value={dayOptions.filter((opt) => field.value?.includes(opt.value))}
            />
          )}
        />
      </div>
      <div className="mb-6">
        <label>{t("selectStore") || "اختر المخزن:"}</label>
        <Controller
          control={control}
          name="store_id"
          render={({ field }) => (
            <Select
              {...field}
              options={storeOptions}
              isClearable
              placeholder={t("selectStore") || "اختر المخزن"}
              onChange={(val) => field.onChange(val?.value)}
              value={storeOptions.find((opt) => opt.value == field.value)}
            />
          )}
        />
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
              options={roles?.data?.data.map((r) => ({
                value: r.name,
                label: r.name || r.name,
              }))}
              placeholder={t("selectRoles") || "اختر الرولز"}
              onChange={(val: MultiValue<{ value: string; label: string }>) =>
                field.onChange(val.map((v) => v.value))
              }
              value={
                roles?.data?.data
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
