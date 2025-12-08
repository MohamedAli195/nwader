import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IAcademicYears,
  useGetAcademicYearsQuery,
} from "../../../../app/features/academicYears/academicYearsSlice";
import {
  IAcademicClasses,
  useUpdateAcademicClassesMutation,
} from "../../../../app/features/academicClasses/academicClassesSlice";
export interface IFormInputClasses {
  name: string;
  academic_year_id: number | null; // ✅ كده يقبل null
}

type Option = {
  label: string;
  value: string | number;
  data: IAcademicYears;
};
interface IProps {
  tempCat: IAcademicClasses | undefined;
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
export default function UpdateacademicClassesForm({
  tempCat,
  onCloseUp,
}: IProps) {
  const [academicYearsData, setAcademicYearsData] =
    useState<IAcademicYears | null>(tempCat?.academic_year ?? null);

  const [updateAcademicClasses, { isLoading }] =
    useUpdateAcademicClassesMutation();
  const { data: AcademicYears, isLoading: AcademicYearsLoad } =
    useGetAcademicYearsQuery({
      search: "",
      page: 1,
    });
  const AcademicYearss = AcademicYears?.data ?? [];
  const AcademicYearsOptions: Option[] =
    AcademicYearss.map((AcademicYear) => ({
      value: AcademicYear.id ?? 0, // <-- رقم، وليس نص
      label: AcademicYear.name,
      data: AcademicYear,
    })) || [];
  const acadmiYearName = tempCat?.name;
  const acadmiYearNameFilter = acadmiYearName?.split(" - ")[0] ?? "";

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<IFormInputClasses>();

  // Effect to populate form values if tempCat is available
  // في useEffect
  useEffect(() => {
    if (tempCat) {
      setValue("name", acadmiYearNameFilter);
      setValue("academic_year_id", tempCat.academic_year?.id ?? null);
    }
  }, [tempCat, setValue, acadmiYearNameFilter]);

  // Form submission handler
  const onSubmit: SubmitHandler<IFormInputClasses> = async (data) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("academic_year_id", String(data.academic_year_id));

    // Call the mutation with the updated data

    try {
      await updateAcademicClasses({
        id: Number(tempCat?.id),
        body: {
          name: `${data.name} - ${academicYearsData?.name}`,
          academic_year_id: data.academic_year_id,
        },
      }).unwrap();
      Swal.fire("Success", "Update Classe Successfully!", "success");
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
        <label className="block mb-1">اسم الصف التعليمى</label>
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
              placeholder="اسم الصف"
              onChange={(val) => {
                field.onChange(val?.value ?? null);
                setAcademicYearsData(val?.data ?? null);
              }}
              value={
                AcademicYearsOptions.find((opt) => opt.value == field.value) ??
                null
              }
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : " تعديل  المادة"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {/* {data && <p style={{ color: "green" }}>store added successfully!</p>} */}
    </form>
  );
}
