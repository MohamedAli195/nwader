import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import Button from "../../../../components/ui/button/Button";
import { useTranslation } from "react-i18next";
import {
  CreateInstitutionRequest,
  Institution,
  useUpdateInstitutionMutation,
} from "../../../../app/features/institution/institutionApi";

interface ApiError {
  data?: {
    errors?: Record<string, string[]>;
  };
}

type Option = {
  label: string;
  value: string | boolean;
};

// Institution type
const institutionTypes: Option[] = [
  { value: "university", label: "University" },
  { value: "institute", label: "Institute" },
  { value: "school", label: "School" },
];

// Activation status
const activeOptions: Option[] = [
  { value: true, label: "Active" },
  { value: false, label: "Inactive" },
];

interface IProps {
  tempInstitution: Institution;
  onCloseUp: () => void;
}

export default function UpdateInstitutionForm({
  tempInstitution,
  onCloseUp,
}: IProps) {
  const { t } = useTranslation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [updateInstitution, { isLoading }] = useUpdateInstitutionMutation();
  const { handleSubmit, setValue, control, register } = useForm<CreateInstitutionRequest>();

  // Set initial values
  useEffect(() => {
    if (tempInstitution) {
      setValue("name", tempInstitution.name);
      setValue("type", tempInstitution.type);
      setValue("description", tempInstitution.description || "");
      setValue("address", tempInstitution.address || "");
      setValue("phone", tempInstitution.phone || "");
      setValue("email", tempInstitution.email || "");
      setValue("website", tempInstitution.website || "");
      setValue("is_active", tempInstitution.is_active);
    }
  }, [tempInstitution, setValue]);

  const onSubmit: SubmitHandler<CreateInstitutionRequest> = async (data) => {
    try {
      const body: CreateInstitutionRequest = { ...data, logo: logoFile ?? null };
      await updateInstitution({ id: tempInstitution.id, data: body }).unwrap();
      Swal.fire(t("Done"), t("Institution updated successfully"), "success");
      onCloseUp();
    } catch (err: unknown) {
      const error = err as ApiError;
      Swal.fire(
        t("Error"),
        error?.data?.errors
          ? Object.values(error.data.errors).flat().join("\n")
          : t("Unexpected error occurred"),
        "error"
      );
    }
  };

  return (
    <form className="flex flex-col gap-3 my-12 p-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      {/* Name */}
      <div>
        <label className="block mb-1">{t("Institution Name")}</label>
        <input {...register("name", { required: true })} className="border p-2 rounded w-full" />
      </div>

      {/* Type */}
      <div>
        <label className="block mb-1">{t("Institution Type")}</label>
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              {...field}
              options={institutionTypes.map(opt => ({ ...opt, label: t(opt.label) }))}
              placeholder={t("Select type")}
              onChange={(val) => field.onChange(val?.value)}
              value={institutionTypes.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* Description */}
      <div className="hidden">
        <label className="block mb-1">{t("Description")}</label>
        <textarea {...register("description")} className="border p-2 rounded w-full" />
      </div>

      {/* Address */}
      <div className="hidden">
        <label className="block mb-1">{t("Address")}</label>
        <input {...register("address")} className="border p-2 rounded w-full" />
      </div>

      {/* Phone */}
      <div className="hidden">
        <label className="block mb-1">{t("Phone Number")}</label>
        <input {...register("phone")} className="border p-2 rounded w-full" />
      </div>

      {/* Email */}
      <div className="hidden">
        <label className="block mb-1">{t("Email")}</label>
        <input {...register("email")} className="border p-2 rounded w-full" />
      </div>

      {/* Website */}
      <div className="hidden">
        <label className="block mb-1">{t("Website")}</label>
        <input {...register("website")} className="border p-2 rounded w-full" />
      </div>

      {/* Logo */}
      <div className="hidden">
        <label className="block mb-1">{t("Logo")}</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Activation Status */}
      <div>
        <label className="block mb-1">{t("Activation Status")}</label>
        <Controller
          control={control}
          name="is_active"
          render={({ field }) => (
            <Select
              {...field}
              options={activeOptions.map(opt => ({ ...opt, label: t(opt.label) }))}
              placeholder={t("Select status")}
              onChange={(val) => field.onChange(val?.value)}
              value={activeOptions.find((opt) => opt.value === field.value)}
            />
          )}
        />
      </div>

      {/* Submit Button */}
      <div>
        <Button className="w-full text-xl" disabled={isLoading}>
          {isLoading ? t("Updating...") : t("update")}
        </Button>
      </div>
    </form>
  );
}
