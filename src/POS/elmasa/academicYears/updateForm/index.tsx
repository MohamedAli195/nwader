import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IAcademicStages,
  useGetAcademicStagesQuery,
} from "../../../../app/features/academicStages/academicStagesSlice";
import {
  IAcademicYears,
  useUpdateAcademicYearMutation,
} from "../../../../app/features/academicYears/academicYearsSlice";
export interface IFormInputEduSys {
  name: string;
  academic_stage_id: number | null; // ✅ كده يقبل null
}
type Option = {
  label: string;
  value: string | number;
  data: IAcademicStages;
};
interface IProps {
  tempCat: IAcademicYears | undefined;
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
export default function UpdateacademicYearsForm({
  tempCat,
  onCloseUp,
}: IProps) {
  const [AcademicStagesData, setAcademicStagesData] =
    useState<IAcademicStages | null>(tempCat?.academic_stage ?? null);
  const AcademicStagesName = tempCat?.name;
  const AcademicStagesNameFilter = AcademicStagesName?.split(" - ")[0] ?? "";
  const [updateAcademicYear, { isLoading }] = useUpdateAcademicYearMutation();
  const { data: AcademicStages, isLoading: AcademicStagesLoad } =
    useGetAcademicStagesQuery({
      search: "",
      page: 1,
    });
  const AcademicStagess = AcademicStages?.data ?? [];
  const AcademicStagesOptions: Option[] =
    AcademicStagess.map((acadmicStage) => ({
      value: acadmicStage.id ?? 0, // <-- رقم، وليس نص
      label: acadmicStage.name,
      data: acadmicStage,
    })) || [];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<IFormInputEduSys>();

  // Effect to populate form values if tempCat is available
  // في useEffect
  useEffect(() => {
    if (tempCat) {
      setValue("name", AcademicStagesNameFilter);
      setValue("academic_stage_id", tempCat.academic_stage?.id ?? null);
    }
  }, [tempCat, setValue, AcademicStagesNameFilter]);

  // Form submission handler
  const onSubmit: SubmitHandler<IFormInputEduSys> = async (data) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", `${data.name} - ${AcademicStagesData?.name} `);
    formData.append("academic_stage_id", String(data.academic_stage_id));

    // Call the mutation with the updated data

    try {
      await updateAcademicYear({
        id: Number(tempCat?.id),
        body: {
          name: `${data.name} - ${AcademicStagesData?.name}`,
          academic_stage_id: data.academic_stage_id,
        },
      }).unwrap();
      Swal.fire("Success", "Update Academic Year Successfully!", "success");
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
        <label htmlFor="">اسم الصف الدراسي</label>
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
        <label className="block mb-1">اسم المرحلة التعليمية </label>
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
              placeholder="اسم المرحلة التعليمية"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
                setAcademicStagesData(val?.data ?? null);
              }}
              value={
                AcademicStagesOptions.find((opt) => opt.value == field.value) ??
                null
              }
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " تعديل الصف التعليمي"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {/* {data && <p style={{ color: "green" }}>store added successfully!</p>} */}
    </form>
  );
}
