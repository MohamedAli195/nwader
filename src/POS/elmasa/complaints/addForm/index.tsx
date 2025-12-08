import { useForm, type SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useEffect } from "react";

// Components
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

// Types & API
import {
  IComplaint,
  useCreateComplaintResponseMutation,
} from "../../../../app/features/complaints/complaintsSlice";
import { errorType } from "../../../../types";

export interface IFormInputNews {
  message: string;
  teacher: string;
  student: string;
  subject: string;
}

interface AddReplayProps {
  onClose: () => void;
  tempCat?: IComplaint;
}

export default function AddReplay({ onClose, tempCat }: AddReplayProps) {
  const [createComplaintResponse, { isLoading }] =
    useCreateComplaintResponseMutation();

  const { register, handleSubmit, setValue } = useForm<IFormInputNews>();

  // تعبئة البيانات عند فتح النموذج
  useEffect(() => {
    if (tempCat) {
      setValue("teacher", tempCat.complaint_about_teacher?.name || "");
      setValue("student", tempCat.submitted_by_student?.name || "");
      setValue("subject", tempCat.subject || "");
    }
  }, [setValue, tempCat]);

  // إرسال الرد
  const onSubmit: SubmitHandler<IFormInputNews> = async (data) => {
    const formData = new FormData();
    formData.append("message", data.message);

    try {
      await createComplaintResponse({
        id: Number(tempCat?.id),
        body: formData,
      }).unwrap();

      Swal.fire("تم", "تم الرد بنجاح", "success");
    } catch (error: unknown) {
      const err = error as errorType;
      Swal.fire(
        "خطأ",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "حدث خطأ غير متوقع",
        "error"
      );
    }

    onClose();
  };

  return (
    <form
      className="flex flex-col gap-4 p-5 my-12 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* الموضوع */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">الشكوى</label>
        <Input
          type="text"
          disabled
          className="bg-gray-100 text-gray-800 font-semibold"
          {...register("subject")}
        />
      </div>

      {/* الطالب */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          اسم الطالب
        </label>
        <Input
          type="text"
          disabled
          className="bg-gray-100 text-gray-800 font-semibold"
          {...register("student")}
        />
      </div>

      {/* الرد */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">الرد</label>
        <Input type="text" {...register("message")} />
      </div>

      {/* زر الإرسال */}
      <div>
        <Button className="w-full text-xl" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "إرسال الرد"}
        </Button>
      </div>
    </form>
  );
}
