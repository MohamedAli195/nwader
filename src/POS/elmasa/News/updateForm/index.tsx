import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  INews,
  useUpdateNewMutation,
} from "../../../../app/features/News/newsSlice";

export interface IFormInputNews {
  title: string;
  content: string;
  image: FileList;
}

interface IProps {
  tempCat: INews | undefined;
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

export default function UpdateNewForm({ tempCat, onCloseUp }: IProps) {
  const [updateNew, { isLoading }] = useUpdateNewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IFormInputNews>();

  useEffect(() => {
    if (tempCat) {
      setValue("title", tempCat.title || "");
      setValue("content", tempCat.content || "");
      // setValue("image", tempCat.image )
    }
  }, [setValue, tempCat]);

  const onSubmit: SubmitHandler<IFormInputNews> = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content || "");
    // if (data.password) formData.append("password", data.password);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    try {
      await updateNew({
        id: Number(tempCat?.id),
        body: formData,
      }).unwrap();
      Swal.fire("تم", "تم تحديث الاستفسار بنجاح", "success");
      onCloseUp();
    } catch (error: unknown) {
      console.log(error);
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
        <label>عنوان الخبر</label>
        <Input
          type="text"
          {...register("title", { required: "عنوان الخبر مطلوب" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label>الوصف</label>
        <Input type="text" {...register("content")} />
      </div>

      <div>
        <label>صورة الخبر</label>
        <Input type="file" accept="image/*" {...register("image")} />
      </div>

      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "جاري التحديث..." : "تحديث بيانات الخبر"}
        </Button>
      </div>
    </form>
  );
}
