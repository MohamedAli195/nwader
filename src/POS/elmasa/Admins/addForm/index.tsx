import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Input from "../../../components/form/input/InputField";
import Button from "../../../components/ui/button/Button";
import { useCreateAdminMutation } from "../../../app/features/Admins/AdminsSlice";
import { useGetStoresQuery } from "../../../app/features/stores/stores";
import Select, { MultiValue } from "react-select";

import { useTranslation } from "react-i18next";
import { errorType } from "../../../types";
import Swal from "sweetalert2";
import { useGetRolesQuery } from "../../../app/features/roles/roles";

export interface IFormInputStore {
  name: string;
  email: string;
  password: string;
  store_id: string;
  phone: string;
  roles: string[];
  type: string;
  base_salary: number;
  hourly_rate: number;
  work_start_time: string;
  work_end_time: string;
  work_days: string[];
}

type Option = {
  label: string;
  value: string | number;
};



export default function AddAdmin({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const [createAdmin, { data, isLoading: isCreating }] =
    useCreateAdminMutation();
  const { data: stores, isLoading: isLoadingStores } = useGetStoresQuery({
    search: "",
    page: 1,
  });

  // const { data: permission } = useGetPermissionsQuery();
  const { data: roles } = useGetRolesQuery();
  const { register, handleSubmit, control  } = useForm<IFormInputStore>();

  // const selectedPermissions = watch("permissions");
  //   const selectedRoles = watch("roles");
  // // const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  // const rolesData = roles?.data;
  
  //   useEffect(() => {
  //   setRoleOptions(
  //     (rolesData?.data ?? [])
  //       .filter((r) => !selectedRoles?.includes(r.name))
  //       .map((r) => ({ value: r.name, label: r.name })) // ممكن تغير label لو عندك display_name
  //   );
  // }, [selectedRoles, rolesData]);

  // useEffect(() => {
  //   setOptions(
  //     (permissionData ?? [])
  //       .filter((p) => !selectedPermissions?.includes(p.name))
  //       .map((p) => ({ value: p.name, label: p.display_name }))
  //   );
  // }, [selectedPermissions, permissionData]);

  const storeOptions: Option[] =
    stores?.data?.data?.map((store) => ({
      value: store.id?.toString() || "",
      label: store.name,
    })) || [];


  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };
  const onSubmit: SubmitHandler<IFormInputStore> = async (data) => {
    try {
      const res = await createAdmin({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        store_id: data.store_id,
        roles: data.roles,
        base_salary: data.base_salary,
        hourly_rate: data.hourly_rate,
        work_start_time: formatTime(data.work_start_time),
        work_end_time: formatTime(data.work_end_time),
        work_days: data.work_days,
      }).unwrap();

      onClose();
      Swal.fire(
        "تمت الإضافة!",
        "تمت إضافة المستخدم التجارية بنجاح.",
        "success"
      );
      console.log(res);
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
      className="grid grid-cols-2 items-center justify-center my-12 gap-2 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label htmlFor="">{t("userName") || "اسم المستخدم"}</label>
        <Input type="text" {...register("name")} />
      </div>

      <div>
        <label>{t("email") || "البريد الالكترونى"}</label>
        <Input type="text" {...register("email")} />
      </div>

      <div>
        <label>{t("phone") || "رقم المحمول"}</label>
        <Input type="text" {...register("phone")} />
      </div>


      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          {t("selectStore") || "اختر المخزن:"}
        </label>
        <Controller
          control={control}
          name="store_id"
          render={({ field }) => (
            <Select
              {...field}
              options={storeOptions}
              isClearable
              isLoading={isLoadingStores}
              placeholder={t("selectStore") || "اختر المخزن"}
              onChange={(val) => field.onChange(val?.value)}
              value={storeOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      <div>
        <label>{t("password") || "كلمة المرور"}</label>
        <Input type="text" {...register("password")} />
      </div>
      <div>
        <label>الراتب الأساسي</label>
        <Input type="number" {...register("base_salary")} />
      </div>

      <div>
        <label>الأجر بالساعة</label>
        <Input type="number" {...register("hourly_rate")} />
      </div>

      <div>
        <label>وقت بداية العمل</label>
        <Controller
          name="work_start_time"
          control={control}
          render={({ field }) => (
            <input
              type="time"
              id="work_start_time"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={field.value ? field.value.slice(0, 5) : ""} // ✅ يضمن صيغة HH:mm
              onChange={(e) => field.onChange(e.target.value)} // ✅ يخزن القيمة المختارة
              step="60" // دقيقة واحدة
              required
            />
          )}
        />
      </div>

      <div>
        <label>وقت نهاية العمل</label>
        <Controller
          name="work_end_time"
          control={control}
          render={({ field }) => (
            <input
              type="time"
              id="work_end_time"
              className="border border-gray-300 rounded-md px-3 py-2 w-full"
              value={field.value ? field.value.slice(0, 5) : ""}
              onChange={(e) => field.onChange(e.target.value)}
              step="60"
              required
            />
          )}
        />
      </div>

      <div className="mb-6">
        <label className="block mb-2 font-semibold text-gray-700">
          أيام العمل
        </label>
        <Controller
          control={control}
          name="work_days"
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={[
                { value: "saturday", label: "السبت" },
                { value: "sunday", label: "الأحد" },
                { value: "monday", label: "الاثنين" },
                { value: "tuesday", label: "الثلاثاء" },
                { value: "wednesday", label: "الأربعاء" },
                { value: "thursday", label: "الخميس" },
                { value: "friday", label: "الجمعة" },
              ]}
              placeholder="اختر أيام العمل"
              onChange={(val) => field.onChange(val.map((v) => v.value))}
              value={field.value?.map((day) => ({
                value: day,
                label:
                  day === "saturday"
                    ? "السبت"
                    : day === "sunday"
                    ? "الأحد"
                    : day === "monday"
                    ? "الاثنين"
                    : day === "tuesday"
                    ? "الثلاثاء"
                    : day === "wednesday"
                    ? "الأربعاء"
                    : day === "thursday"
                    ? "الخميس"
                    : "الجمعة",
              }))}
            />
          )}
        />
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
        <Button
          className="w-full text-3xl"
          type={"submit"}
          disabled={isCreating}
        >
          {isCreating
            ? t("loadingBtn") || "انتظر..."
            : t("addAdminButton") || "إضافة مدير"}
        </Button>
      </div>

      {data && (
        <p style={{ color: "green" }}>
          {t("adminAddedSuccess") || "تم إضافة المدير بنجاح!"}
        </p>
      )}
    </form>
  );
}
