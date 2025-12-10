import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/button/Button";
import { IStudent, useUpdateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";
import { useGetInstitutionsQuery } from "../../../../app/features/institution/institutionApi";
import { Loader2 } from "lucide-react";

interface IProps {
  tempCat: IStudent | undefined;
  onCloseUp: () => void;
}

export interface IStudentsInputs {
  id?: number;
  first_name: string | undefined;
  email: string;
  institution_id: string;
  phone: string;
  password?: string;
  password_confirmation?: string;
}

export default function UpdateAcademicStudentForm({ tempCat, onCloseUp }: IProps) {
  const { t } = useTranslation();
  const { data: Institut, isLoading: isLoadingInstitutions } = useGetInstitutionsQuery();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);
  const [updateAcademicStudents, { isLoading }] = useUpdateAcademicStudentsMutation();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<IStudentsInputs>();

  useEffect(() => {
    if (tempCat) {
      setValue("first_name", tempCat.first_name);
      setValue("email", tempCat.email);
      setValue("phone", tempCat.phone);
      setValue("institution_id", tempCat.institution_id.toString());
      setSelectedInstitutionId(Number(tempCat.institution_id));
    }
  }, [tempCat, setValue]);

  const onSubmit: SubmitHandler<IStudentsInputs> = async (formDataObj) => {
    try {
      const formData = new FormData();
      Object.entries(formDataObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value.toString());
      });

      await updateAcademicStudents({ id: Number(tempCat?.id), body: formData }).unwrap();
      Swal.fire(t("updated_success"), "", "success");
      onCloseUp();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Swal.fire(t("error_occurred"), err?.data?.message || "", "error");
    }
  };

  if (isLoadingInstitutions) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  // عنصر input محسّن
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function InputField({ label, error, ...props }: any) {
    return (
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        <input
          {...props}
          className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 p-5" onSubmit={handleSubmit(onSubmit)}>
      <InputField
        label={t("first_name")}
        {...register("first_name", { required: t("required_field") })}
        error={errors.first_name?.message}
      />
      <InputField
        label={t("email")}
        type="email"
        {...register("email", { required: t("required_field") })}
        error={errors.email?.message}
      />
      <InputField
        label={t("phone")}
        {...register("phone", { required: t("required_field") })}
        error={errors.phone?.message}
      />
      <InputField
        label={t("password_optional")}
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      <InputField
        label={t("password_confirmation")}
        type="password"
        {...register("password_confirmation")}
        error={errors.password_confirmation?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700 dark:text-gray-300">{t("select_institution")}:</label>
        <select
          {...register("institution_id", { required: t("required_field") })}
          className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          value={selectedInstitutionId || ""}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
        >
          <option value="">{t("choose_option")}</option>
          {Institut?.data.map((inst) => (
            <option key={inst.id} value={inst.id}>
              {inst.name} ({inst.type})
            </option>
          ))}
        </select>
      </div>

      <Button
        className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg"
        disabled={isLoading}
      >
        {isLoading ? t("loading") : t("update")}
      </Button>
    </form>
  );
}
