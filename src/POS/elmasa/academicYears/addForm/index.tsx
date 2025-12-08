import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { useCreateAcademicYearMutation } from "../../../../app/features/academicYears/academicYearsSlice";
import { IAcademicStages, useGetAcademicStagesQuery } from "../../../../app/features/academicStages/academicStagesSlice";
import { useState } from "react";

export interface IFormInputEduSys {
  name: string;
  academic_stage_id: number;
}

type Option = {
  label: string;
  value: string | number;
  data:IAcademicStages;
};
export default function AddAcademicYears({ onClose }: { onClose: () => void }) {
  const [AcademicStagesData, setAcademicStagesData] = useState<IAcademicStages | null>(null);
  const { data: AcademicStages, isLoading: AcademicStagesLoad } = useGetAcademicStagesQuery({
    search: "",
    page: 1,
  });
  const AcademicStagess = AcademicStages?.data ?? [];
  const AcademicStagesOptions: Option[] =
    AcademicStagess.map((acadmicStage) => ({
      value: acadmicStage.id?.toString() || "",
      label: acadmicStage.name,
      data:acadmicStage
    })) || [];
  const [createAcademicYear, { data, isLoading }] =
    useCreateAcademicYearMutation();
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
    formData.append("name", `${data.name} - ${AcademicStagesData?.name} `);
    formData.append("academic_stage_id", String(data.academic_stage_id));
    try {
      await createAcademicYear(formData).unwrap(); // This will throw if there's an error
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
        <label htmlFor="">اسم الصف الدراسى</label>
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
        <label className="block mb-1">اسم المرحلة التعليمية</label>
        <Controller
          control={control}
          name="academic_stage_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={AcademicStagesOptions}
              isClearable
              className="w-auto"
              isLoading={AcademicStagesLoad}
              placeholder="اسم الصف التعليمى"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
                setAcademicStagesData(val?.data ?? null);
              }}
              value={AcademicStagesOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة الصف دراسي"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && (
        <p style={{ color: "green" }}>Academic-Year added successfully!</p>
      )}
    </form>
  );
}
