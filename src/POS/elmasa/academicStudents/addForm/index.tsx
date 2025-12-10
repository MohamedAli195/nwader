import { useForm, SubmitHandler } from "react-hook-form";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Button from "../../../../components/ui/button/Button";
import { useCreateAcademicStudentsMutation } from "../../../../app/features/academicStudent/academicStudentApi";
import { useGetInstitutionsQuery } from "../../../../app/features/institution/institutionApi";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { IStudentsInputs } from "../updateForm";

export default function AddAcademicStudent({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();

  const { data: Institut, isLoading: isLoadingInstitutions } = useGetInstitutionsQuery();
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);
  const [createAcademicStudents, { isLoading }] = useCreateAcademicStudentsMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<IStudentsInputs>();

  const onSubmit: SubmitHandler<IStudentsInputs> = async (formDataObj) => {
    try {
      const formData = new FormData();
      Object.entries(formDataObj).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value.toString());
      });

      await createAcademicStudents(formData).unwrap();
      Swal.fire(t("added_success"), "", "success");
      onClose();
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
        label={t("password")}
        type="password"
        {...register("password", { required: t("required_field") })}
        error={errors.password?.message}
      />
      <InputField
        label={t("password_confirmation")}
        type="password"
        {...register("password_confirmation", { required: t("required_field") })}
        error={errors.password_confirmation?.message}
      />

      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-700 dark:text-gray-300">{t("select_institution")}:</label>
        <select
          {...register("institution_id", { required: t("required_field") })}
          className="w-full md:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={selectedInstitutionId || ""}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
        >
          <option value="">{t("choose_option")}</option>
          {Institut?.data.map((inst) => (
            <option key={inst.id || "na"} value={inst.id || 0}>
              {inst.name} ({inst.type})
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg" disabled={isLoading}>
        {isLoading ? t("loading") : t("submit")}
      </Button>
    </form>
  );
}
