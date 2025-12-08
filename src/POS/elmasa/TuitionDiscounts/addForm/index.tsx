import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { errorType } from "../../../../types";
import { useCreateTuitionDiscountMutation } from "../../../../app/features/TuitionDiscounts/TuitionDiscountsApi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useGetSchoolsQuery } from "../../../../app/features/schools/schoolsApi";
import Select from "react-select";

interface IFormInput {
  title: string;
  description: string;
  discount_percentage: number;
  school_id: number;
  start_date: string;
  end_date: string;
  max_uses: number;
  is_active: boolean;
}

type Option = {
  label: string;
  value: string | number;
};
export default function AddTuitionDiscountForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const [createTuitionDiscount, { isLoading }] = useCreateTuitionDiscountMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      is_active: true,
    },
  });
  const { data: schoolsData, isLoading: schoolsLoading } = useGetSchoolsQuery({
  search: "",
  page: 1,
});

const schools = schoolsData?.data ?? [];

const schoolOptions: Option[] =
  schools.map((school) => ({
    value: school.id?.toString() || "",
    label: school.name,
    data: school,
  })) || [];

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await createTuitionDiscount({
        ...data,
        discount_percentage: Number(data.discount_percentage),
        school_id: Number(data.school_id),
        max_uses: Number(data.max_uses),
      }).unwrap();

      Swal.fire("تم بنجاح ✅", "تمت إضافة خصم الرسوم الدراسية بنجاح", "success");
      reset();
      onClose();
    } catch (error: unknown) {
      const err = error as errorType;

      const message =
        err?.data?.errors?.message ||
        (err?.data?.errors
          ? Object.values(err.data.errors).flat().join("\n")
          : "حدث خطأ غير متوقع");

      Swal.fire("خطأ ❌", message, "error");
    }
  };

  return (
    <form
      className="flex flex-col my-12 gap-4 p-6 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* العنوان */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">عنوان الخصم</label>
        <Input
          type="text"
          placeholder="Early Bird Discount 2024"
          {...register("title", { required: "العنوان مطلوب" })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* الوصف */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">الوصف</label>
        <textarea
          className="w-full border rounded-lg p-2 min-h-[100px]"
          placeholder="Get 15% off tuition fees for early registration"
          {...register("description", { required: "الوصف مطلوب" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* نسبة الخصم */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">نسبة الخصم (%)</label>
        <Input
          type="number"
          step="1"
          placeholder="15"
          {...register("discount_percentage", {
            required: "نسبة الخصم مطلوبة",
            min: { value: 0, message: "يجب أن تكون النسبة أكبر من 0" },
            max: { value: 100, message: "لا يمكن أن تتجاوز النسبة 100%" },
          })}
        />
        {errors.discount_percentage && (
          <p className="text-red-500 text-sm">{errors.discount_percentage.message}</p>
        )}
      </div>

      {/* المدرسة */}
       <div className="mb-4">
    <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">
      المدرسة
    </label>
    <Controller
      control={control}
      name="school_id"
      rules={{ required: "اختيار المدرسة مطلوب" }}
      render={({ field }) => (
        <Select<Option, false>
          {...field}
          options={schoolOptions}
          isClearable
          className="w-full"
          isLoading={schoolsLoading}
          placeholder="اختر المدرسة"
          onChange={(val) => field.onChange(val?.value ?? null)}
          value={schoolOptions.find((opt) => opt.value === field.value)}
        />
      )}
    />
    {errors.school_id && (
      <p className="text-red-500 text-sm">{errors.school_id.message}</p>
    )}
  </div>

      {/* تاريخ البداية */}
      {/* تاريخ البداية */}
{/* تاريخ البداية */}
<div>
  <label className="block mb-1 text-gray-700 font-medium">تاريخ البداية</label>
  <Controller
    name="start_date"
    control={control}
    rules={{
      required: "تاريخ البداية مطلوب",
      validate: (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // تجاهل الوقت
        return (
          selectedDate >= today || "تاريخ البداية يجب أن يكون اليوم أو بعده"
        );
      },
    }}
    render={({ field }) => (
      <DatePicker
        selected={field.value ? new Date(field.value) : null}
        onChange={(date) =>
          field.onChange(date ? date.toISOString().split("T")[0] : "")
        }
        dateFormat="yyyy-MM-dd"
        placeholderText="اختر تاريخ البداية"
        className="border px-2 py-1 rounded-md text-center bg-white w-full"
        isClearable
        minDate={new Date()} // ✅ يمنع اختيار تاريخ قبل اليوم
      />
    )}
  />
  {errors.start_date && (
    <p className="text-red-500 text-sm">{errors.start_date.message}</p>
  )}
</div>
      {/* تاريخ النهاية */}
{/* تاريخ النهاية */}
<div>
  <label className="block mb-1 text-gray-700 font-medium">تاريخ النهاية</label>
  <Controller
    name="end_date"
    control={control}
    rules={{
      required: "تاريخ النهاية مطلوب",
      validate: (value) => {
        const start = watch("start_date"); // نجيب تاريخ البداية من الفورمة
        if (!start) return "يجب اختيار تاريخ البداية أولاً";

        const startDate = new Date(start);
        const endDate = new Date(value);

        return (
          endDate > startDate ||
          "تاريخ النهاية يجب أن يكون بعد تاريخ البداية"
        );
      },
    }}
    render={({ field }) => (
      <DatePicker
        selected={field.value ? new Date(field.value) : null}
        onChange={(date) =>
          field.onChange(date ? date.toISOString().split("T")[0] : "")
        }
        dateFormat="yyyy-MM-dd"
        placeholderText="اختر تاريخ النهاية"
        className="border px-2 py-1 rounded-md text-center bg-white w-full"
        isClearable
        minDate={
          watch("start_date") ? new Date(watch("start_date")) : new Date()
        } // ✅ يمنع اختيار تاريخ قبل البداية
      />
    )}
  />
  {errors.end_date && (
    <p className="text-red-500 text-sm">{errors.end_date.message}</p>
  )}
</div>




      {/* الحد الأقصى للاستخدام */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          الحد الأقصى للاستخدام
        </label>
        <Input
          type="number"
          placeholder="100"
          {...register("max_uses", { required: "الحد الأقصى مطلوب" })}
        />
        {errors.max_uses && (
          <p className="text-red-500 text-sm">{errors.max_uses.message}</p>
        )}
      </div>

      {/* الحالة */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked />
        <label>الخصم نشط</label>
      </div>

      {/* الزر */}
      <Button className="w-full text-lg py-2" disabled={isLoading}>
        {isLoading ? "جارٍ الإضافة..." : "إضافة الخصم"}
      </Button>
    </form>
  );
}
