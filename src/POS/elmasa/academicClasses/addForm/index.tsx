import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";

import Swal from "sweetalert2";
import { errorType } from "../../../../types";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import { IAcademicYears, useGetAcademicYearsQuery } from "../../../../app/features/academicYears/academicYearsSlice";
import { useCreateAcademicClassesMutation } from "../../../../app/features/academicClasses/academicClassesSlice";
import { useState } from "react";

export interface IFormInputClasses {
  name: string;
  academic_year_id: number;
}

type Option = {
  label: string;
  value: string | number;
  data:IAcademicYears
};
export default function AddAcademicClasses({
  onClose,
}: {
  onClose: () => void;
}) {
  const [academicYearsData, setAcademicYearsData] = useState<IAcademicYears | null>(null);
  //fetch suppliers
  const { data: AcademicYears, isLoading: AcademicYearsLoad } = useGetAcademicYearsQuery({
    search: "",
    page: 1,
  });
  const AcademicYearss = AcademicYears?.data ?? [];
  const AcademicYearsOptions: Option[] =
    AcademicYearss.map((AcademicYear) => ({
      value: AcademicYear.id?.toString() || "",
      label: AcademicYear.name,
      data:AcademicYear
    })) || [];

  const [createAcademicClasses, { data, isLoading }] =
    useCreateAcademicClassesMutation();
  // Log the state for debugging
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInputClasses>();
  const onSubmit: SubmitHandler<IFormInputClasses> = async (data) => {
    // Prepare FormData to send as a POST request
    const formData = new FormData();
    formData.append("name", `${data.name} - ${academicYearsData?.name}`);
    formData.append("academic_year_id", String(data.academic_year_id));
    try {
      await createAcademicClasses(formData).unwrap(); // This will throw if there's an error
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
        <label htmlFor="">اسم المادة</label>
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
        <label className="block mb-1">اسم الص الدراسي</label>
        <Controller
          control={control}
          name="academic_year_id"
          render={({ field }) => (
            <Select<Option, false>
              {...field}
              options={AcademicYearsOptions}
              isClearable
              className="w-auto"
              isLoading={AcademicYearsLoad}
              placeholder="اسم الصف التعليمى"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
                 setAcademicYearsData(val?.data ?? null);
              }}
              value={AcademicYearsOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " اضافة مادة"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {data && <p style={{ color: "green" }}>Classes added successfully!</p>}
    </form>
  );
}
