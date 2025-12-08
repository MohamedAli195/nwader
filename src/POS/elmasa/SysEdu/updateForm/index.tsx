import { useForm, SubmitHandler } from "react-hook-form";

import { useEffect } from "react";
import Swal from "sweetalert2";
import {
  IEduSystems,
  useUpdateEduSystemMutation,
} from "../../../../app/features/EduSystems/EduSystemsSlice";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";

interface IProps {
  tempCat: IEduSystems | undefined;
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
export default function UpdateEduSysForm({ tempCat, onCloseUp }: IProps) {
  const [updateEduSystem, { isLoading }] = useUpdateEduSystemMutation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IEduSystems>();

  // Effect to populate form values if tempCat is available
  useEffect(() => {
    if (tempCat) {
      setValue("name", tempCat?.name);
      setValue("description", tempCat?.description);
      {
        /* تم تغيير "notes" إلى "nots" */
      }
    }
  }, [setValue, tempCat]);

  // Form submission handler
  const onSubmit: SubmitHandler<IEduSystems> = async (data) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    {
      /* تم تغيير "notes" إلى "nots" */
    }

    try {
      await updateEduSystem({
        id: Number(tempCat?.id),
        body: {
          name: data.name,
          description: data.description,
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
      className="flex justify-center flex-col my-12 gap-2 p-5 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Name input */}
      <div>
        <label>اسم نظام التعليم</label>
        <Input
          type="text"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Notes input */}
      <div>
        <label>الوصف</label>
        <Input className="h-24" type="text" {...register("description")} />{" "}
        {/* تم تغيير "notes" إلى "nots" */}
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : "تعديل نظام التعليم"}
        </Button>
      </div>
    </form>
  );
}
