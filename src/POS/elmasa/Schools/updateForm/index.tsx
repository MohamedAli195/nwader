import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  ISchool,
  useUpdateSchoolMutation,
} from "../../../../app/features/schools/schoolsApi";

interface IProps {
  tempSchool: ISchool | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors?: Record<string, string[]>;
    message?: string;
  };
  status: number;
}

export default function UpdateSchoolForm({ tempSchool, onCloseUp }: IProps) {
  const [updateSchool, { isLoading }] = useUpdateSchoolMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Partial<ISchool>>(); // ✅ نستخدم Partial لتحديث جزئي

  // 🧠 تعبئة القيم الحالية عند فتح المودال
  useEffect(() => {
    if (tempSchool) {
      setValue("name", tempSchool.name);
      setValue("description", tempSchool.description);
      setValue("phone", tempSchool.phone);
    }
  }, [tempSchool, setValue]);

  // 📨 عند إرسال النموذج
  const onSubmit: SubmitHandler<Partial<ISchool>> = async (data) => {
    try {
      await updateSchool({
        id: Number(tempSchool?.id),
        body: {
          name: data.name,
          description: data.description,
          phone: data.phone,
        },
      }).unwrap();

      Swal.fire("تم بنجاح ✅", "تم تحديث بيانات المدرسة", "success");
      onCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;
      const message =
        err.data?.errors && Object.values(err.data.errors).flat().join("\n");

      Swal.fire(
        "خطأ ❌",
        message || err.data?.message || "حدث خطأ أثناء التعديل",
        "error"
      );
    }
  };

  return (
    <form
      className="flex flex-col my-8 gap-3 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* الاسم */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          اسم المدرسة
        </label>
        <Input
          type="text"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* الوصف */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          الوصف
        </label>
        <textarea
          {...register("description")}
          className="w-full h-28 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* الهاتف */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          الهاتف
        </label>
        <Input
          type="text"
          {...register("phone", { required: "رقم الهاتف مطلوب" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Button className="w-full text-lg" disabled={isLoading}>
          {isLoading ? "جاري التعديل..." : "تحديث بيانات المدرسة"}
        </Button>
      </div>
    </form>
  );
}
