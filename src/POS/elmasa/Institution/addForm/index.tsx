import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import Button from "../../../../components/ui/button/Button";
import { useState } from "react";
import {
  CreateInstitutionRequest,
  useAddInstitutionMutation,
} from "../../../../app/features/institution/institutionApi";
interface ApiError {
  data?: {
    errors?: Record<string, string[]>;
  };
}

type Option = {
  label: string;
  value: string | number | boolean;
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

export default function AddInstitution({ onClose }: { onClose: () => void }) {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [addInstitution, { isLoading }] = useAddInstitutionMutation();

  const { handleSubmit, control, register } =
    useForm<CreateInstitutionRequest>();

  const onSubmit: SubmitHandler<CreateInstitutionRequest> = async (data) => {
    try {
      const body: CreateInstitutionRequest = {
        ...data,
        logo: logoFile,
      };

      await addInstitution(body).unwrap();

      Swal.fire("تم", "تم إضافة المؤسسة بنجاح", "success");
      onClose();
    } catch (err: unknown) {
  const error = err as ApiError; // نحدد النوع هنا فقط بعد catch
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
            <Select<Option, false>
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
        <input {...register("address")} className="border p-2 rounded w-full" />
      </div>

      {/* الهاتف */}
      <div className="hidden">
        <label className="block mb-1">رقم الهاتف</label>
        <input {...register("phone")} className="border p-2 rounded w-full" />
      </div>

      {/* البريد */}
      <div className="hidden">
        <label className="block mb-1">البريد الإلكتروني</label>
        <input {...register("email")} className="border p-2 rounded w-full" />
      </div>

      {/* الموقع */}
      <div className="hidden">
        <label className="block mb-1">الموقع الإلكتروني</label>
        <input {...register("website")} className="border p-2 rounded w-full" />
      </div>

      {/* الشعار */}
      <div className="hidden">
        <label className="block mb-1">الشعار (Logo)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* حالة التفعيل */}
      <div>
        <label className="block mb-1">حالة التفعيل</label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={activeOptions}
              placeholder="اختر الحالة"
              onChange={(val) => field.onChange(val?.value ?? false)}
              value={activeOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* زر الإرسال */}
      <div>
        <Button className="w-full text-xl" disabled={isLoading}>
          {isLoading ? "جارٍ الإضافة..." : "إضافة المؤسسة"}
        </Button>
      </div>
    </form>
  );
}
