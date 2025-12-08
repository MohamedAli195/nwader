import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { IEduSystems, useGetEduSystemsQuery } from "../../../../app/features/EduSystems/EduSystemsSlice";
import { useCreateAcademicStageMutation } from "../../../../app/features/academicStages/academicStagesSlice";
import { useState } from "react";

export interface IFormInputEduSys {
  name: string;
  educational_system_id: number;
}

type Option = {
  label: string;
  value: string | number;
  data:IEduSystems
};
export default function AddAcademicStages({
  onClose,
}: {
  onClose: () => void;
}) {
  const [eduSysData, setEduSysData] = useState<IEduSystems | null>(null);

  //fetch suppliers
  const { data: eduSys, isLoading: eduSysLoad } = useGetEduSystemsQuery({
    search: "",
    page: 1,
  });
  const EduSystemss = eduSys?.data ?? [];
  const eduSysOptions: Option[] =
    EduSystemss.map((eduSys) => ({
      value: eduSys.id?.toString() || "",
      label: eduSys.name,
      data:eduSys
    })) || [];
  const [createAcademicStage, { data, isLoading }] =
    useCreateAcademicStageMutation();
  // Log the state for debugging
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputEduSys>();
  const onSubmit: SubmitHandler<IFormInputEduSys> = async (data) => {
    // Prepare FormData to send as a POST request
    const formData = new FormData();
    formData.append("name", `${data.name} - ${eduSysData?.name}` );
    formData.append(
      "educational_system_id",
      String(data.educational_system_id)
    );
    try {
      await createAcademicStage(formData).unwrap(); // This will throw if there's an error
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
        <label htmlFor="">اسم المرحلة الدراسية</label>
        <Input
          type="text"
          {...register("name", { required: "حقل الاسم مطلوب" })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Description inputs for different languages */}

      <div className="flex items-center gap-1">
        <label className="block mb-1">اسم النظام التعليمى</label>
        <Controller
          control={control}
          name="educational_system_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={eduSysOptions}
              isClearable
              className="w-auto"
              isLoading={eduSysLoad}
              placeholder="اسم النظام التعليمى"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
                 setEduSysData(val?.data ?? null);
              }}
              value={eduSysOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة مرحلة دراسية"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && <p style={{ color: "green" }}>store added successfully!</p>}
    </form>
  );
}
