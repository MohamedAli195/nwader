import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";

export interface IFormInputStudents {
  name: string;
  phone: string;
  password: string;
}

export default function AddAcademicStudent({
  onClose,
}: {
  onClose: () => void;
}) {
  // const [eduSysData, setEduSysData] = useState<IEduSystems | null>(null);

  const [createAcademicStudents, { data, isLoading }] =
    useCreateAcademicStudentsMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputStudents>();

  const onSubmit: SubmitHandler<IFormInputStudents> = async (data) => {
    // Prepare FormData to send as a POST request
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("password", data.password);
    try {
      await createAcademicStudents(formData).unwrap(); // This will throw if there's an error
      Swal.fire("تم ", "تم بنجاح", "success");
    } catch (error: unknown) {
      const err = error as errorType;

      Swal.fire(
        "Error",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "Something went wrong",
        "error"
      );
    }
    onClose();
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form
      className="flex justify-center  flex-col my-12 gap-2 p-5 w-full "
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name inputs for different languages */}

      <div>
        <label htmlFor="">اسم الطالب</label>
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
          {...register("phone", { required: "حقل الاسم مطلوب" })}
        />
        {errors.phone && (
          <p className="text-red-500 text-sm">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="">الباسورد</label>
        <Input
          type="text"
          {...register("password", { required: "حقل الاسم مطلوب" })}
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة طالب"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && <p style={{ color: "green" }}>Student added successfully!</p>}
    </form>
  );
}
