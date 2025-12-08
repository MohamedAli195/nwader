import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import { Modal } from "../../components/ui/modal";
import RolesTable from "./viewBrand";
import AddRole from "./AddBrands";
// import { useTranslation } from "react-i18next";

const Roles = () => {
  // const { t } = useTranslation();
  const [isOpen, SetIsOpen] = useState(false);

  const onClose = () => {
    SetIsOpen(false);
  };

  const onOpen = () => {
    SetIsOpen(true);
  };

  return (
    <ComponentCard
      onOpen={onOpen}
      title={"صلاحيات المستخدمين"}
      className="w-full">
      <RolesTable />
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}>
        <h1 className="flex justify-center p-3 text-3xl">
          {"إضافة صلاحية"}
        </h1>
        <AddRole onClose={onClose} />
      </Modal>
    </ComponentCard>
  );
};

export default Roles;
