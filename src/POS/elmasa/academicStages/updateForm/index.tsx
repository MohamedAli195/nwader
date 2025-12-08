import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  IEduSystems,
  useGetEduSystemsQuery,
} from "../../../../app/features/EduSystems/EduSystemsSlice";
import Input from "../../../../components/form/input/InputField";
import Button from "../../../../components/ui/button/Button";
import {
  IAcademicStages,
  useUpdateAcademicStageMutation,
} from "../../../../app/features/academicStages/academicStagesSlice";
export interface IFormInputEduSys {
  name: string;
  educational_system_id: number | null; // ✅ كده يقبل null
}

type Option = {
  label: string;
  value: string | number;
  data: IEduSystems;
};
interface IProps {
  tempCat: IAcademicStages | undefined;
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
export default function UpdateacademicStagesForm({
  tempCat,
  onCloseUp,
}: IProps) {
  const [eduSysData, setEduSysData] = useState<IEduSystems | null>(
    tempCat?.educational_system ?? null
  );
  const acadmiStageName = tempCat?.name;
  const acadmiStageNameFilter = acadmiStageName?.split(" - ")[0] ?? "";

  const [updateAcademicStage, { isLoading }] = useUpdateAcademicStageMutation();
  const { data: eduSys, isLoading: eduSysLoad } = useGetEduSystemsQuery({
    search: "",
    page: 1,
  });
  const EduSystemss = eduSys?.data ?? [];
  const eduSysOptions: Option[] =
    EduSystemss.map((eduSys) => ({
      value: eduSys.id?.toString() || "",
      label: eduSys.name,
      data: eduSys,
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
      setValue("name", acadmiStageNameFilter);
      setValue("educational_system_id", tempCat.educational_system?.id ?? null);
    }
  }, [tempCat, setValue, acadmiStageNameFilter]);

  // Form submission handler
  const onSubmit: SubmitHandler<IFormInputEduSys> = async (data) => {
    // Create FormData object
    const formData = new FormData();
    formData.append("name", `${data.name} - ${eduSysData?.name}`);
    formData.append(
      "educational_system_id",
      String(data.educational_system_id)
    );

    // Call the mutation with the updated data

    try {
      await updateAcademicStage({
        id: Number(tempCat?.id),
        body: {
          name: `${data.name} - ${eduSysData?.name}`,
          educational_system_id: data.educational_system_id,
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
              value={
                eduSysOptions.find((opt) => opt.value == field.value) ?? null
              }
            />
          )}
        />
      </div>

      {/* Submit button */}
      <div>
        <Button className="w-full text-3xl" disabled={isLoading}>
          {isLoading ? "انتظر..." : "تحديث المرحلة"}
        </Button>
      </div>

      {/* Error and success handling */}
      {/* {isError && <p style={{ color: "red" }}>Error: {error?.message}</p>} */}
      {/* {data && <p style={{ color: "green" }}>store added successfully!</p>} */}
    </form>
  );
}
