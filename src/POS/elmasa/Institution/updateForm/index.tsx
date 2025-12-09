import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import Button from "../../../../components/ui/button/Button";
import {
  CreateInstitutionRequest,
  Institution,
  useUpdateInstitutionMutation,
} from "../../../../app/features/institution/institutionApi";

interface ApiError {
  data?: {
    errors?: Record<string, string[]>;
  };
}

type Option = {
  label: string;
  value: string | boolean;
};

// نوع المؤسسة
const institutionTypes: Option[] = [
  { value: "university", label: "جامعة" },
  { value: "institute", label: "معهد" },
  { value: "school", label: "مدرسة" },
];

// حالة التفعيل
const activeOptions: Option[] = [
  { value: true, label: "مفعل" },
  { value: false, label: "غير مفعل" },
];

interface IProps {
  tempInstitution: Institution;
  onCloseUp: () => void;
}

export default function UpdateInstitutionForm({
  tempInstitution,
  onCloseUp,
}: IProps) {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [updateInstitution, { isLoading }] = useUpdateInstitutionMutation();

  const { handleSubmit, setValue, control, register } =
    useForm<CreateInstitutionRequest>();

  // تعيين القيم المبدئية
  useEffect(() => {
    if (tempInstitution) {
      setValue("name", tempInstitution.name);
      setValue("type", tempInstitution.type);
      setValue("description", tempInstitution.description || "");
      setValue("address", tempInstitution.address || "");
      setValue("phone", tempInstitution.phone || "");
      setValue("email", tempInstitution.email || "");
      setValue("website", tempInstitution.website || "");
      setValue("is_active", tempInstitution.is_active);
    }
  }, [tempInstitution, setValue]);

  const onSubmit: SubmitHandler<CreateInstitutionRequest> = async (data) => {
    try {
      // إرسال File فقط إذا اختار المستخدم شعار جديد
      const body: CreateInstitutionRequest = {
        ...data,
        logo: logoFile ?? null,
      };

      await updateInstitution({ id: tempInstitution.id, data: body }).unwrap();
      Swal.fire("تم", "تم تعديل المؤسسة بنجاح", "success");
      onCloseUp();
    } catch (err: unknown) {
      const error = err as ApiError;
      Swal.fire(
        "خطأ",
        error?.data?.errors
          ? Object.values(error.data.errors).flat().join("\n")
          : "حدث خطأ غير متوقع",
        "error"
      );
    }
  };

  return (
    <form
      className="flex flex-col gap-3 my-12 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* الاسم */}
      <div>
        <label className="block mb-1">اسم المؤسسة</label>
        <input
          {...register("name", { required: true })}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* النوع */}
      <div>
        <label className="block mb-1">نوع المؤسسة</label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              {...field}
              options={institutionTypes}
              placeholder="اختر النوع"
              onChange={(val) => field.onChange(val?.value)}
              value={institutionTypes.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* الوصف */}
      <div className="hidden">
        <label className="block mb-1">الوصف</label>
        <textarea
          {...register("description")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* العنوان */}
      <div className="hidden">
        <label className="block mb-1">العنوان</label>
        <input
          {...register("address")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* الهاتف */}
      <div className="hidden">
        <label className="block mb-1">رقم الهاتف</label>
        <input
          {...register("phone")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* البريد */}
      <div className="hidden">
        <label className="block mb-1">البريد الإلكتروني</label>
        <input
          {...register("email")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* الموقع */}
      <div className="hidden">
        <label className="block mb-1">الموقع الإلكتروني</label>
        <input
          {...register("website")}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* الشعار */}
      <div className="hidden">
        <label className="block mb-1">الشعار (Logo)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* حالة التفعيل */}
      <div >
        <label className="block mb-1">حالة التفعيل</label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Select
              {...field}
              options={activeOptions}
              placeholder="اختر الحالة"
              onChange={(val) => field.onChange(val?.value)}
              value={activeOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* زر الإرسال */}
      <div>
        <Button className="w-full text-xl" disabled={isLoading}>
          {isLoading ? "جارٍ التحديث..." : "تحديث المؤسسة"}
        </Button>
      </div>
    </form>
  );
}
