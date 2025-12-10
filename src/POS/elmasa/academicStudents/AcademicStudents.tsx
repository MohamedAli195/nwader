import { useState } from "react";
import { useTranslation } from "react-i18next";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";
import AcadimicStudentsTable from "./table";
import AddAcademicStudent from "./addForm";

const AcademicStudents = () => {
  const { t } = useTranslation();

  const [isOpen, SetIsOpen] = useState(false);

  const onClose = () => SetIsOpen(false);
  const onOpen = () => SetIsOpen(true);

  return (
    <ComponentCard onOpen={onOpen} title={t("students")}>
      <AcadimicStudentsTable />
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}
      >
        <h1 className="flex justify-center p-3 text-3xl">{t("students")}</h1>
        <AddAcademicStudent onClose={onClose} />
      </Modal>
    </ComponentCard>
  );
};

export default AcademicStudents;
