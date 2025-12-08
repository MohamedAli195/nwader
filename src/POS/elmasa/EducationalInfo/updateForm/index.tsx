import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IEducationalInformation,
  useUpdateEducationalInformationMutation,
} from "../../../../app/features/EducationsalInfo/educationalInfo";

interface IProps {
  tempInfo: IEducationalInformation | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors?: Record<string, string[]>;
    message?: string;
  };
  status: number;
}

export default function UpdateEducationalInfoForm({
  tempInfo,
  onCloseUp,
}: IProps) {
  const [updateEducationalInformation, { isLoading }] =
    useUpdateEducationalInformationMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IEducationalInformation>();

  // تعبئة البيانات عند فتح المودال
  useEffect(() => {
    if (tempInfo) {
      setValue("title", tempInfo.title);
      setValue("content", tempInfo.content);
      setValue("type", tempInfo.type);
      setValue("is_active", tempInfo.is_active);
    }
  }, [tempInfo, setValue]);

  // إرسال التحديث
  const onSubmit: SubmitHandler<IEducationalInformation> = async (data) => {
    try {
      await updateEducationalInformation({
        id: Number(tempInfo?.id),
        body: {
          title: data.title,
          content: data.content,
          type: data.type,
          is_active: data.is_active,
        },
      }).unwrap();

      Swal.fire("تم بنجاح ✅", "تم تعديل المعلومة التعليمية", "success");
      onCloseUp();
    } catch (error: unknown) {
      console.log(error);
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
      {/* العنوان */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          العنوان
        </label>
        <Input
          type="text"
          {...register("title", { required: "حقل العنوان مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* المحتوى */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          المحتوى
        </label>
        <textarea
          {...register("content", { required: "حقل المحتوى مطلوب" })}
          className="w-full h-28 rounded-lg border border-gray-300 px-3 py-2 text-gray-800 dark:bg-gray-700 dark:text-white"
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      {/* النوع */}
      <div>
        <label className="font-medium text-gray-700 dark:text-gray-300">
          النوع
        </label>
        <Input
          type="text"
          {...register("type", { required: "حقل النوع مطلوب" })}
        />
        {errors.type && (
          <p className="text-red-500 text-sm">{errors.type.message}</p>
        )}
      </div>

      {/* الحالة */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          id="is_active"
          {...register("is_active")}
          className="w-5 h-5 accent-blue-600"
        />
        <label htmlFor="is_active" className="text-gray-700 dark:text-gray-300">
          الحالة (نشط)
        </label>
      </div>

      {/* زر الإرسال */}
      <div className="mt-5">
        <Button className="w-full text-lg" disabled={isLoading}>
          {isLoading ? "جاري التعديل..." : "تعديل المعلومة التعليمية"}
        </Button>
      </div>
    </form>
  );
}
