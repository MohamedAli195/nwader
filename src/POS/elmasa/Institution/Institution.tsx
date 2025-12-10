import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";
import InstitutionsTable from "./table";
import AddInstitution from "./addForm";
import { t } from "i18next";

const Institution = () => {
  const [isOpen, SetIsOpen] = useState(false);

  const onClose = () => {
    SetIsOpen(false);
  };

  const onOpen = () => {
    SetIsOpen(true);
  };
  return (
    <ComponentCard onOpen={onOpen} title={t("institutions") || "الجامعات و المدارس"}>
      <InstitutionsTable />
      <Modal
        className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}
      >
        <h1 className="flex justify-center p-3  text-3xl">الجامعات و المدارس</h1>
        <AddInstitution onClose={onClose} />
      </Modal>
    </ComponentCard>
  );
};

export default Institution;
