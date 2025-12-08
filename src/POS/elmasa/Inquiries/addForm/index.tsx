import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useEffect } from "react";
import {
  Iinquiries,
  useCreateInquirieResponseMutation,
} from "../../../../app/features/inquiries/inquiriesSlice";

export interface IFormInputNews {
  message: string;
  author: string;
  subject: string;
  replay: string;
}

export default function AddReplay({
  onClose,
  tempCat,
}: {
  onClose: () => void;
  tempCat: Iinquiries | undefined;
}) {
  const [createInquirieResponse, { isLoading }] =
    useCreateInquirieResponseMutation();

  const { register, handleSubmit, setValue } = useForm<IFormInputNews>();

  useEffect(() => {
    if (tempCat) {
      setValue("author", tempCat?.author?.name || "");
      setValue("subject", tempCat?.subject || "");
      setValue("message", tempCat?.message || "");
    }
  }, [setValue, tempCat]);

  const onSubmit: SubmitHandler<IFormInputNews> = async (data) => {
    const formData = new FormData();
    formData.append("message", data.replay);

    try {
      await createInquirieResponse({
        id: Number(tempCat?.id),
        body: formData,
      }).unwrap();
      Swal.fire("تم", "تمت إضافة الرد بنجاح", "success");
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
      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          الموضوع
        </label>
        <Input
          type="text"
          disabled
          className="bg-gray-100 text-gray-900 font-medium"
          {...register("subject")}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          مرسل الاستفسار
        </label>
        <Input
          type="text"
          disabled
          className="bg-gray-100 text-gray-900 font-medium"
          {...register("author")}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">
          الاستفسار
        </label>
        <Input
          type="text"
          disabled
          className="bg-gray-100 text-gray-900 font-medium"
          {...register("message")}
        />
      </div>

      <div>
        <label className="block mb-1 font-semibold text-gray-700">الرد</label>
        <Input
          type="text"
          className="bg-white text-gray-900"
          {...register("replay")}
        />
      </div>

      <div>
        <Button className="w-full text-lg font-semibold" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "إرسال الرد"}
        </Button>
      </div>
    </form>
  );
}
