import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Button from "../../../../components/ui/button/Button";
import { IStudent, useUpdateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";
import { useGetInstitutionsQuery } from "../../../../app/features/institution/institutionApi";
import { Loader2 } from "lucide-react";

interface IProps {
  tempCat: IStudent | undefined;
  onCloseUp: () => void;
}
export interface IStudentsInputs {
  id?:number
  first_name: string | undefined;
  email: string;
  institution_id: string;
  phone: string;
  // is_active: boolean;
  password?: string;
   password_confirmation?:string

}


export default function UpdateAcademicStudentForm({ tempCat, onCloseUp }: IProps) {
  const { data: Institut, isLoading: isLoadingInstitutions } = useGetInstitutionsQuery();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);

  const [updateAcademicStudents, { isLoading }] = useUpdateAcademicStudentsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IStudentsInputs>();

  // تعبئة البيانات في الفورم عند فتح صفحة التحديث
  useEffect(() => {
    if (tempCat) {
      setValue("first_name", tempCat.first_name);
      setValue("email", tempCat.email);
      setValue("phone", tempCat.phone);
      setValue("institution_id", tempCat.institution_id.toString());
      // setValue("is_active", tempCat.is_active ? true : false);

      setSelectedInstitutionId(Number(tempCat.institution_id));
    }
  }, [tempCat, setValue]);

  const onSubmit: SubmitHandler<IStudentsInputs> = async (formDataObj) => {
    try {
      const formData = new FormData();

      const payload = {
        ...formDataObj,

      };

      Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      await updateAcademicStudents({
        id: Number(tempCat?.id),
        body: formData,
      }).unwrap();

      Swal.fire("تم", "تم تعديل الطالب بنجاح", "success");
      onCloseUp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Swal.fire("خطأ", err?.data?.message || "حدث خطأ ما", "error");
    }
  };

  // تحميل قائمة المؤسسات
  if (isLoadingInstitutions) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-3 p-5" onSubmit={handleSubmit(onSubmit)}>

      <InputField
        label="الاسم الأول"
        {...register("first_name", { required: "حقل الاسم الأول مطلوب" })}
        error={errors.first_name?.message}
      />

      <InputField
        label="البريد الإلكتروني"
        type="email"
        {...register("email", { required: "حقل البريد مطلوب" })}
        error={errors.email?.message}
      />

      <InputField
        label="رقم الهاتف"
        {...register("phone", { required: "حقل الهاتف مطلوب" })}
        error={errors.phone?.message}
      />

      <InputField
        label="كلمة المرور (اختياري)"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
       <InputField
        label="تأكيد كلمة المرور"
        type="password"
        {...register("password_confirmation", { required: "حقل كلمة المرور مطلوب" })}
        error={errors.password?.message}
      />

      {/* اختيار المؤسسة */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">اختر المؤسسة:</label>
        <select
          {...register("institution_id", { required: "حقل المؤسسة مطلوب" })}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={selectedInstitutionId || ""}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
        >
          <option value="">-- اختر مؤسسة --</option>
          {Institut?.data.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name} ({inst.type})
            </option>
          ))}
        </select>
      </div>


      <Button className="w-full mt-3" disabled={isLoading}>
        {isLoading ? "انتظر..." : "تحديث الطالب"}
      </Button>
    </form>
  );
}

// عنصر input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function InputField({ label, error, ...props }: any) {
  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input {...props} className="border p-2 rounded w-full" />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
