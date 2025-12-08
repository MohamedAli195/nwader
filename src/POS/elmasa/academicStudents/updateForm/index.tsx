import { useForm, SubmitHandler } from "react-hook-form";

import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IStudents,
  useUpdateAcademicStudentsMutation,
} from "../../../../app/features/academicStudent/academicStudentApi";
export interface IFormInputEduSys {
  name: string;
  phone: string;
  // password: string;
}

interface IProps {
  tempCat: IStudents | undefined;
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
export default function UpdateacademicStudentsForm({
  tempCat,
  onCloseUp,
}: IProps) {
  const [updateAcademicStudents, { isLoading }] =
    useUpdateAcademicStudentsMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputEduSys>();

  // Effect to populate form values if tempCat is available
  // في useEffect
  useEffect(() => {
    if (tempCat) {
      setValue("name", tempCat.name);
      setValue("phone", tempCat.phone);
      // setValue("password", tempCat.password ?? "");
    }
  }, [tempCat, setValue]);

  // Form submission handler
  const onSubmit: SubmitHandler<IFormInputEduSys> = async (data) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    // formData.append("password", data.password);

    // Call the mutation with the updated data

    try {
      await updateAcademicStudents({
        id: Number(tempCat?.id),
        body: {
          name: data.name,
          phone: data.phone,
          // password: data.password,
        },
      }).unwrap();
      Swal.fire("Success", "تم التعديل بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      console.log(error);
      const err = error as errorType;

      Swal.fire(
        "Error",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "Something went wrong",
        "error"
      );
    }
    onCloseUp();
  };

  return (
    <form
      className="flex justify-center  flex-col my-12 gap-2 p-5 w-full "
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name inputs for different languages */}

      <div>
        <label htmlFor="">اسم المرحلة الدراسية</label>
        <Input
          type="text"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="">الهاتف</label>
        <Input
          type="text"
          {...register("phone", { required: "حقل الهاتف مطلوب" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>
      {/* <div>
        <label htmlFor="">الباسورد</label>
        <Input
          type="text"
          {...register("password", { required: "حقل الباسورد مطلوب" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div> */}

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : "تحديث"}
        </Button>
      </div>
    </form>
  );
}
