import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
// import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";
import { useGetInstitutionsQuery } from "../../../../app/features/institution/institutionApi";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IStudentsInputs } from "../updateForm";

// export interface IStudents {
  
//   first_name: string;
//   email: string;
//   institution_id: string;
//   phone: string;
//   // is_active: boolean; 
//   password?: string;
//   password_confirmation?:string
//   // student_id: string;
//   // registered_at: string;
// // id?: number;
// }

export default function AddAcademicStudent({
  onClose,
}: {
  onClose: () => void;
}) {
   const { data:Institut, isLoading:isLoadingInstitutions } = useGetInstitutionsQuery();
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);
  const [createAcademicStudents, { isLoading }] =
    useCreateAcademicStudentsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },

  } = useForm<IStudentsInputs>();


const onSubmit: SubmitHandler<IStudentsInputs> = async (formDataObj) => {
  try {
    const formData = new FormData();

    // تحويل is_active من boolean إلى 0 أو 1
    const payload = {
      ...formDataObj,

    };

    Object.entries(payload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    await createAcademicStudents(formData).unwrap();
    Swal.fire("تم", "تم اضافة الطالب بنجاح", "success");
    onClose();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    Swal.fire("خطأ", err?.data?.message || "حدث خطأ ما", "error");
  }
};

  // معالجة تحميل قائمة المؤسسات
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
        label="كلمة المرور"
        type="password"
        {...register("password", { required: "حقل كلمة المرور مطلوب" })}
        error={errors.password?.message}
      />
       <InputField
        label="تأكيد كلمة المرور"
        type="password"
        {...register("password_confirmation", { required: "حقل كلمة المرور مطلوب" })}
        error={errors.password?.message}
      />



      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">اختر المؤسسة:</label>
        <select
        {...register("institution_id", { required: "حقل المؤسسة مطلوب" })}
          className="w-full md:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={selectedInstitutionId || ""}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
        >
          <option value="">-- اختر مؤسسة --</option>
          {Institut?.data.map((inst) => (
            <option key={inst.id || "na"} value={inst.id || 0}>
              {inst.name} ({inst.type})
            </option>
          ))}
        </select>
      </div>

   {/* <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked />
        <label>مفعل</label>
      </div> */}

      <Button className="w-full mt-3" disabled={isLoading}>
        {isLoading ? "انتظر..." : "اضافة طالب"}
      </Button>
    </form>
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function InputField({ label, error, ...props }: any) {
    return (
      <div>
        <label>{label}</label>
        <input {...props} className="border p-2 rounded w-full" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
}
