import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  ITeacher,
  useUpdateTeatcherMutation,
} from "../../../../app/features/teachers/teachersSlice";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

export interface ITeatcherInput {
  name: string;
  phone: string;
  password?: string;
  current_workplace?: string;
  specialization: string;
  work_title?: string;
  phone2?: string;
  home_address?: string;
  work_address?: string;
  country?: string;
  city?: string;
  district?: string;
  desc?: string;
  years_of_experience?: number;
  national_id_egypt?: string;
  residence_number_outside_egypt?: string;
  is_online?: string | boolean;
  is_offline?: string | boolean;
  home_availability: string | boolean;
  image?: FileList;
}

interface IProps {
  tempCat: ITeacher | undefined;
  onCloseUp: () => void;
}

interface errorType {
  data: {
    errors: {
      name: string[];
      message: string;
    };
  };
  status: number;
}

export default function UpdateTeatcherForm({ tempCat, onCloseUp }: IProps) {
  const [updateTeatcher, { isLoading }] = useUpdateTeatcherMutation();
  console.log(tempCat);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ITeatcherInput>();
  useEffect(() => {
    if (tempCat) {
      setValue("name", tempCat.name || "");
      setValue("phone", tempCat.phone || "");
      setValue("current_workplace", tempCat.profile.workplace || "");
      setValue("specialization", tempCat.profile.specialization || "");
      setValue("work_title", tempCat.profile.title || "");
      setValue("phone2", tempCat.profile.phone2 || "");
      setValue("home_address", tempCat.profile.home_address || "");
      setValue("work_address", tempCat.profile.work_address || "");
      setValue("country", tempCat.profile.country || "");
      setValue("city", tempCat.profile.city || "");
      setValue("district", tempCat.profile.district || "");
      setValue("desc", tempCat.profile.description || "");
      setValue("years_of_experience", tempCat.profile.experience_years);
      setValue("national_id_egypt", tempCat.profile.national_id_egypt || "");
      setValue(
        "residence_number_outside_egypt",
        tempCat.profile.residence_number_outside_egypt || ""
      );
      setValue("is_online", tempCat.availability.online);
      setValue("is_offline", tempCat.availability.offline);
      setValue("home_availability", tempCat.availability.at_home);
    }
  }, [setValue, tempCat]);
const isOfflineValue = !!watch("is_offline"); // هيرجع true أو false مباشرة
  console.log(isOfflineValue)

  const onSubmit: SubmitHandler<ITeatcherInput> = async (data) => {
    console.log(data)
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone || "");
    if (data.password) formData.append("password", data.password);
    formData.append("current_workplace", data.current_workplace || "");
    formData.append("specialization", data.specialization);
    formData.append("work_title", data.work_title || "");
    formData.append("phone2", data.phone2 || "");
    formData.append("home_address", data.home_address || "");
    formData.append("work_address", data.work_address || "");
    formData.append("country", data.country || "");
    formData.append("city", data.city || "");
    formData.append("district", data.district || "");
    formData.append("desc", data.desc || "");
    formData.append(
      "years_of_experience",
      String(data.years_of_experience || 0)
    );
    formData.append("national_id_egypt", data.national_id_egypt || "");
    formData.append(
      "residence_number_outside_egypt",
      data.residence_number_outside_egypt || ""
    );
    formData.append("is_online", String(data.is_online ==="true" ? "1" : "0"));
    formData.append("is_offline", String(data.is_offline ==="true" ? "1" : "0"));
    if(data.is_offline==="true"){
formData.append(
      "home_availability",
      String(data.home_availability ? "1" : "0")
    );
    }else {
      formData.append(
      "home_availability",
      String(data.home_availability = "0")
    );
    }
    

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await updateTeatcher({
        id: Number(tempCat?.id),
        body: formData,
      }).unwrap();
      Swal.fire("تم", "تم تحديث بيانات المعلم بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      const err = error as errorType;
      console.log(err);

      // تجهيز رسالة الأخطاء
      let errorMessage = "حدث خطأ ما";

      if (err?.data?.errors) {
        // لو errors object فيه حقول متعددة
        if (typeof err.data.errors === "object") {
          errorMessage = Object.values(err.data.errors)
            .flat() // لو كل قيمة array من الرسائل
            .join("\n");
        } else if (typeof err.data.errors === "string") {
          errorMessage = err.data.errors;
        }
      }
      onCloseUp();

      Swal.fire("خطأ", errorMessage, "error");

    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto p-6 rounded-2xl bg-white dark:bg-gray-900 w-full max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="col-span-2">
          <label>الاسم</label>
          <Input
            type="text"
            {...register("name", { required: "الاسم مطلوب" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label>رقم الهاتف</label>
          <Input
            type="text"
            {...register("phone", { required: "رقم المحمول مطلوب" })}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label>كلمة المرور</label>
          <Input type="password" {...register("password")} />
        </div>

        <div>
          <label>جهة العمل الحالية</label>
          <Input type="text" {...register("current_workplace")} />
        </div>

        <div>
          <label>التخصص</label>
          <Input type="text" {...register("specialization")} />
        </div>

        <div>
          <label>المسمى الوظيفي</label>
          <Input type="text" {...register("work_title")} />
        </div>

        <div>
          <label>هاتف إضافي</label>
          <Input type="text" {...register("phone2")} />
        </div>

        <div>
          <label>عنوان السكن</label>
          <Input type="text" {...register("home_address")} />
        </div>

        <div>
          <label>عنوان العمل</label>
          <Input type="text" {...register("work_address")} />
        </div>

        <div>
          <label>الدولة</label>
          <Input type="text" {...register("country")} />
        </div>
        <div>
          <label>المدينة</label>
          <Input type="text" {...register("city")} />
        </div>
        <div>
          <label>الحى</label>
          <Input type="text" {...register("district")} />
        </div>

        <div className="col-span-2">
          <label>الوصف</label>
          <Input className="h-24" type="text" {...register("desc")} />
        </div>

        <div>
          <label>سنوات الخبرة</label>
          <Input type="number" {...register("years_of_experience")} />
        </div>

        <div>
          <label>الرقم القومي (للمصريين)</label>
          <Input
            type="text"
            {...register("national_id_egypt", {
              required: "الرقم القومي مطلوب",
              pattern: {
                value: /^\d{14,}$/, // 15 رقم أو أكثر
                message: "الرقم القومي يجب أن يكون 14 رقمًا أو أكثر",
              },
            })}
          />
          {errors.national_id_egypt && (
            <p className="text-red-500 text-sm">
              {errors.national_id_egypt.message}
            </p>
          )}
        </div>
        <div>
          <label>رقم الإقامة (لغير المصريين)</label>
          <Input type="text" {...register("residence_number_outside_egypt")} />
        </div>
        <div>
          <label>يُدرّس أونلاين؟</label>
          <select
            {...register("is_online")}
            className="w-full border rounded-lg p-2"
          >
            <option value={"false"}>لا</option>
            <option value={"true"}>نعم</option>
          </select>
        </div>

        <div>
          <label>يُدرّس أوفلاين؟</label>
          <select
            {...register("is_offline")}
            className="w-full border rounded-lg p-2"
          >
            <option value={"false"}>لا</option>
            <option value={"true"}>نعم</option>
          </select>
        </div>
        {/* الحقل الإضافي يظهر فقط إذا اختار نعم */}
        {isOfflineValue === true && (
          <div className="col-span-2 flex items-center gap-2">
            <input
              type="checkbox"
              {...register("home_availability")}
              className="w-4 h-4"
            />
            <label>هل متاح التدريس من المنزل؟</label>
          </div>
        )}

        <div className="col-span-2">
          <label>صورة المعلم</label>
          <Input type="file" accept="image/*" {...register("image")} />
        </div>

        <div className="col-span-2 mt-4">
          <Button
            className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg"
            disabled={isLoading}
          >
            {isLoading ? "جاري الإضافة..." : "تعديل المعلم"}
          </Button>
        </div>
      </form>
    </div>
  );
}
