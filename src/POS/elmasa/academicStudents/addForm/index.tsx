import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
// import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";

export interface IStudents {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  date_of_birth: string;
  student_id: string;
  institution_id: string;
  bio: string;
  profile_image: File | null;
  phone: string;
  registered_at: string;
  is_active: boolean; // <-- تم التعديل هنا
  password?: string;
}

export default function AddAcademicStudent({
  onClose,
}: {
  onClose: () => void;
}) {
  const [createAcademicStudents, { isLoading }] =
    useCreateAcademicStudentsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IStudents>({
    defaultValues: {
      profile_image: null,
      is_active: true,
    },
  });


const onSubmit: SubmitHandler<IStudents> = async (formDataObj) => {
  try {
    const formData = new FormData();

    // تحويل is_active من boolean إلى 0 أو 1
    const payload = {
      ...formDataObj,
      is_active: formDataObj.is_active ? 1 : 0,
    };

    Object.entries(payload).forEach(([key, value]) => {
      if (key === "profile_image" && value instanceof File) {
        formData.append("profile_image", value);
      } else if (value !== undefined && value !== null) {
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


  return (
    <form className="flex flex-col gap-3 p-5" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label="الاسم الأول"
        {...register("first_name", { required: "حقل الاسم الأول مطلوب" })}
        error={errors.first_name?.message}
      />
      <InputField
        label="الاسم الأخير"
        {...register("last_name", { required: "حقل الاسم الأخير مطلوب" })}
        error={errors.last_name?.message}
      />
      <InputField
        label="اسم المستخدم"
        {...register("username", { required: "حقل اسم المستخدم مطلوب" })}
        error={errors.username?.message}
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
        label="تاريخ الميلاد"
        type="date"
        {...register("date_of_birth", { required: "حقل تاريخ الميلاد مطلوب" })}
        error={errors.date_of_birth?.message}
      />
      <InputField
        label="رقم الطالب"
        {...register("student_id", { required: "حقل رقم الطالب مطلوب" })}
        error={errors.student_id?.message}
      />
      <InputField
        label="معرف المؤسسة"
        {...register("institution_id", { required: "حقل المؤسسة مطلوب" })}
        error={errors.institution_id?.message}
      />
      <div>
        <label>نبذة عن الطالب</label>
        <textarea {...register("bio")} className="border p-2 rounded w-full" />
      </div>
      <div>
        <label>تاريخ التسجيل</label>
        <InputField
          type="date"
          {...register("registered_at", {
            required: "حقل تاريخ التسجيل مطلوب",
          })}
          error={errors?.registered_at?.message}
        />
      </div>
   <div className="flex items-center gap-2">
        <input type="checkbox" {...register("is_active")} defaultChecked />
        <label>مفعل</label>
      </div>
      <div>
        <label>صورة الملف الشخصي</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setValue("profile_image", e.target.files ? e.target.files[0] : null)
          }
        />
      </div>
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
