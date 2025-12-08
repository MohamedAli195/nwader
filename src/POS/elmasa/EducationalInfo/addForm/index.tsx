import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { errorType } from "../../../../types";
import {
  useCreateEducationalInformationMutation,
} from "../../../../app/features/EducationsalInfo/educationalInfo";
import Select from "react-select";
import { useGetEduSystemsQuery } from "../../../../app/features/EduSystems/EduSystemsSlice";
interface IFormInput {
  title: string;
  content: string;
  type?: string;
  educational_system_id: number;
  order?: number;
  is_active?: boolean;
}
type Option = {
  label: string;
  value: string | number;
};
export default function AddEducationalContentForm({ onClose }: { onClose: () => void }) {
  const [createEducationalInfo, { isLoading }] =
    useCreateEducationalInformationMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<IFormInput>({
    defaultValues: {
      is_active: true,
      order: 1,
      type: "explanation",
    },
  });
   const { data: eduSys, isLoading: eduSysLoad } = useGetEduSystemsQuery({
      search: "",
      page: 1,
    });
    const EduSystemss = eduSys?.data ?? [];
    const eduSysOptions: Option[] =
      EduSystemss.map((eduSys) => ({
        value: eduSys.id?.toString() || "",
        label: eduSys.name,
        data:eduSys
      })) || [];

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      await createEducationalInfo(data).unwrap();

      Swal.fire("تم بنجاح", "تمت إضافة المحتوى التعليمي بنجاح", "success");
      reset();
      onClose();
    } catch (error: unknown) {
      const err = error as errorType;
      Swal.fire(
        "خطأ",
        err?.data?.errors
          ? Object.values(err.data.errors).join("\n")
          : "حدث خطأ غير متوقع",
        "error"
      );
    }
  };

  return (
    <form
      className="flex flex-col my-12 gap-4 p-6 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* العنوان */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">العنوان</label>
        <Input
          type="text"
          placeholder="مثلاً: What is the American Curriculum?"
          {...register("title", { required: "حقل العنوان مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      {/* المحتوى */}
      <div>
        <label className="block mb-1 text-gray-700 font-medium">المحتوى</label>
        <textarea
          className="w-full border rounded-lg p-2 min-h-[100px]"
          placeholder="اكتب تفاصيل المحتوى هنا..."
          {...register("content", { required: "حقل المحتوى مطلوب" })}
        />
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}
      </div>

      {/* النوع */}
      {/* <div>
        <label className="block mb-1 text-gray-700 font-medium">النوع</label>
        <select
          className="w-full border rounded-lg p-2"
          {...register("type", { required: true })}
        >
          <option value="explanation">شرح</option>
          <option value="lesson">درس</option>
          <option value="quiz">اختبار</option>
        </select>
      </div> */}

      {/* النظام التعليمي */}
       <label className="block mb-1">اسم الص الدراسي</label>
              <Controller
                control={control}
                name="educational_system_id"
                render={({ field }) => (
                  <Select<Option, false>
                    {...field}
                    options={eduSysOptions}
                    isClearable
                    className="w-auto"
                    isLoading={eduSysLoad}
                    placeholder="اسم الصف التعليمى"
                    onChange={(val) => {
                      field.onChange(val?.value ?? null);
                    }}
                    value={eduSysOptions.find((opt) => opt.value === field.value)}
                  />
                )}
              />

      {/* ترتيب العرض */}
      {/* <div>
        <label className="block mb-1 text-gray-700 font-medium">
          ترتيب العرض
        </label>
        <Input
          type="number"
          {...register("order", { valueAsNumber: true })}
          placeholder="1"
        />
      </div> */}

      {/* الحالة */}
      <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked />
        <label>مفعل</label>
      </div>

      {/* الزر */}
      <Button className="w-full text-lg py-2" disabled={isLoading}>
        {isLoading ? "جارٍ الإضافة..." : "إضافة المحتوى التعليمي"}
      </Button>
    </form>
  );
}
