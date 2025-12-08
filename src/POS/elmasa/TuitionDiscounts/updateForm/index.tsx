import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { ITuitionDiscount, useUpdateTuitionDiscountMutation } from "../../../../app/features/TuitionDiscounts/TuitionDiscountsApi";

interface IProps {
  tempDiscount: ITuitionDiscount | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors?: Record<string, string[]>;
    message?: string;
  };
  status: number;
}

export default function UpdateTuitionDiscountForm({
  tempDiscount,
  onCloseUp,
}: IProps) {
  const [updateTuitionDiscount, { isLoading }] =
    useUpdateTuitionDiscountMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Partial<ITuitionDiscount>>(); // ✅ لتحديث جزئي فقط

  // 🧠 تعبئة البيانات الحالية عند فتح المودال
  useEffect(() => {
    if (tempDiscount) {
      setValue("title", tempDiscount.title);
      setValue("description", tempDiscount.description);
      setValue("discount_percentage", tempDiscount.discount_percentage);
      setValue("max_uses", tempDiscount.max_uses);
    }
  }, [tempDiscount, setValue]);

  // 📨 عند إرسال النموذج
  const onSubmit: SubmitHandler<Partial<ITuitionDiscount>> = async (data) => {
    try {
      await updateTuitionDiscount({
        id: Number(tempDiscount?.id),
        body: {
          title: data.title,
          description: data.description,
          discount_percentage: data.discount_percentage,
          max_uses: data.max_uses,
        },
      }).unwrap();

      Swal.fire("تم بنجاح ✅", "تم تحديث بيانات الخصم", "success");
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
      {/* عنوان الخصم */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          عنوان الخصم
        </label>
        <Input
          type="text"
          {...register("title", { required: "عنوان الخصم مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
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

      {/* نسبة الخصم */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          نسبة الخصم (%)
        </label>
        <Input
          type="number"
          step="0.01"
          {...register("discount_percentage", {
            required: "نسبة الخصم مطلوبة",
            min: { value: 0, message: "يجب أن تكون النسبة أكبر من 0" },
          })}
        />
        {errors.discount_percentage && (
          <p className="text-red-500 text-sm">
            {errors.discount_percentage.message}
          </p>
        )}
      </div>

      {/* الحد الأقصى للاستخدام */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          الحد الأقصى للاستخدام
        </label>
        <Input
          type="number"
          {...register("max_uses", {
            required: "الحد الأقصى مطلوب",
            min: { value: 1, message: "يجب أن يكون 1 على الأقل" },
          })}
        />
        {errors.max_uses && (
          <p className="text-red-500 text-sm">{errors.max_uses.message}</p>
        )}
      </div>

      <div className="mt-5">
        <Button className="w-full text-lg" disabled={isLoading}>
          {isLoading ? "جاري التعديل..." : "تحديث بيانات الخصم"}
        </Button>
      </div>
    </form>
  );
}
