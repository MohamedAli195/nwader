import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateNewMutation } from "../../../../app/features/News/newsSlice";
export interface IFormInputNews {
  title: string;
  description: string;
  image: FileList;
}
export default function AddNew({ onClose }: { onClose: () => void }) {
  const [createNew, { isLoading }] = useCreateNewMutation();
  // Log the state for debugging
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputNews>();
  const onSubmit: SubmitHandler<IFormInputNews> = async (data) => {
    // Prepare FormData to send as a POST request
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    // if (data.password) formData.append("password", data.password);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await createNew(formData).unwrap(); // This will throw if there's an error
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
    <form
      className="flex justify-center flex-col my-12 gap-4 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <label>الاسم</label>
        <Input
          type="text"
          {...register("title", { required: "الاسم مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label> الوصف</label>
        <Input type="text" {...register("description")} />
      </div>

      <div>
        <label>صورة الخبر</label>
        <Input type="file" accept="image/*" {...register("image")} />
      </div>

      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "اضافة خبر"}
        </Button>
      </div>
    </form>
  );
}
