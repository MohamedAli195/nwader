import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { errorType } from "../../../../types";
import { useCreateSchoolMutation } from "../../../../app/features/schools/schoolsApi";

interface IFormInput {
  name: string;
  governorate: string;
  type: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  is_active: boolean;
}

export default function AddSchoolForm({ onClose }: { onClose: () => void }) {
  const [createSchool, { isLoading }] = useCreateSchoolMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      is_active: true,
      type: "american",
    },
  });

  // 🧠 عند الإرسال
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await createSchool(data).unwrap();

      Swal.fire("تم بنجاح ✅", "تمت إضافة المدرسة بنجاح", "success");
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
      {/* اسم المدرسة */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          اسم المدرسة
        </label>
        <Input
          type="text"
          placeholder="مثلاً: Cairo American School"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* المحافظة */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">المحافظة</label>
        <Input
          type="text"
          placeholder="Cairo"
          {...register("governorate", { required: "حقل المحافظة مطلوب" })}
        />
        {errors.governorate && (
          <p className="text-red-500 text-sm">{errors.governorate.message}</p>
        )}
      </div>

      {/* نوع المدرسة */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          نوع المدرسة
        </label>
        <select
          className="w-full border rounded-lg p-2"
          {...register("type", { required: "النوع مطلوب" })}
        >
          <option value="american">American</option>
          <option value="british">British</option>
          <option value="international">International</option>
          <option value="national">National</option>
        </select>
      </div>

      {/* الوصف */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">الوصف</label>
        <textarea
          className="w-full border rounded-lg p-2 min-h-[100px]"
          placeholder="وصف المدرسة..."
          {...register("description", { required: "الوصف مطلوب" })}
        />
        {errors.description && (
          <p className="text-red-500 text-sm">{errors.description.message}</p>
        )}
      </div>

      {/* العنوان */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">العنوان</label>
        <Input
          type="text"
          placeholder="Maadi, Cairo, Egypt"
          {...register("address", { required: "العنوان مطلوب" })}
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* رقم الهاتف */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          رقم الهاتف
        </label>
        <Input
          type="text"
          placeholder="+20 2 2754 3000"
          {...register("phone", { required: "رقم الهاتف مطلوب" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      {/* البريد الإلكتروني */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          البريد الإلكتروني
        </label>
        <Input
          type="email"
          placeholder="info@cairoschool.edu.eg"
          {...register("email", { required: "البريد الإلكتروني مطلوب" })}
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* الموقع الإلكتروني */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">
          الموقع الإلكتروني
        </label>
        <Input
          type="text"
          placeholder="https://www.cairoschool.edu.eg"
          {...register("website")}
        />
      </div>

      {/* الحالة */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked />
        <label>المدرسة نشطة</label>
      </div>

      {/* الزر */}
      <Button className="w-full text-lg py-2" disabled={isLoading}>
        {isLoading ? "جارٍ الإضافة..." : "إضافة المدرسة"}
      </Button>
    </form>
  );
}
