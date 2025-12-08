import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IComplaint,
  useUpdateComplaintMutation,
} from "../../../../app/features/complaints/complaintsSlice";
import Select from "react-select";

interface IProps {
  tempCat: IComplaint | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors: {
      name?: string[];
      message?: string;
    };
  };
  status: number;
}

type Option = {
  label: string;
  value: string;
};

export default function UpdateComplaintForm({ tempCat, onCloseUp }: IProps) {
  const [updateComplaint, { isLoading }] = useUpdateComplaintMutation();

  const { register, handleSubmit, setValue, control } = useForm<IComplaint>();

  const statusOptions: Option[] = [
    { value: "pending", label: "قيد الانتظار" },
    { value: "in_progress", label: "جاري المعالجة" },
    { value: "resolved", label: "تم الحل" },
    { value: "closed", label: "مغلق" },
  ];

  useEffect(() => {
    if (tempCat) {
      setValue("status", tempCat.status || "");
      setValue("subject", tempCat.subject || "");
    }
  }, [setValue, tempCat]);

  const onSubmit: SubmitHandler<IComplaint> = async (data) => {
    const formData = new FormData();
    formData.append("status", String(data.status || "")); // 🔹 ضمان سترينج
    console.log(data.status);
    try {
      await updateComplaint({
        id: Number(tempCat?.id),
        status: data.status,
      }).unwrap();

      Swal.fire("تم", "تم تحديث الشكوى بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;
      Swal.fire(
        "خطأ",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "حدث خطأ ما",
        "error"
      );
    }
  };

  return (
    <form
      className="flex justify-center flex-col my-12 gap-4 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label>الموضوع</label>
        <Input
          type="text"
          disabled
          {...register("subject", { required: "الموضوع مطلوب" })}
        />
      </div>

      <div className="flex items-center gap-1">
        <label className="block mb-1">الحالة</label>
        <Controller
          control={control}
          name="status"
          rules={{ required: "الحالة مطلوبة" }} // 🔹 مطلوب
          render={({ field, fieldState }) => (
            <div className="w-full">
              <Select<Option, false>
                options={statusOptions}
                isClearable
                className="w-auto"
                placeholder="اختر الحالة"
                onChange={(val) => field.onChange(val ? String(val.value) : "")} // 🔹 ضمان سترينج
                value={statusOptions.find((opt) => opt.value === field.value)}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "تحديث الشكوى"}
        </Button>
      </div>
    </form>
  );
}
