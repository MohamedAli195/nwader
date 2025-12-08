import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateEduSystemMutation } from "../../../../app/features/EduSystems/EduSystemsSlice";

export interface IFormInputEduSys {
  name: string;
  description: string;
}

export default function AddEduSys({ onClose }: { onClose: () => void }) {
  const [createStore, { data, isLoading }] = useCreateEduSystemMutation();
  // Log the state for debugging
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputEduSys>();
  const onSubmit: SubmitHandler<IFormInputEduSys> = async (data) => {
    // Prepare FormData to send as a POST request
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    try {
      await createStore(formData).unwrap(); // This will throw if there's an error
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
        <label htmlFor="">اسم نظام التعليم</label>
        <Input
          type="text"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description inputs for different languages */}

      <div>
        <label>الوصف </label>
        <Input className="h-24" type="text" {...register("description")} />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة نظام"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && <p style={{ color: "green" }}> added successfully!</p>}
    </form>
  );
}
