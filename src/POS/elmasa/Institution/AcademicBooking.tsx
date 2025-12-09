import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import { Modal } from "../../../components/ui/modal";
import AcadimicBookingsTable from "./table";
import AddAcademicBooking from "./addForm";

const AcademicBooking = () => {
  const [isOpen, SetIsOpen] = useState(false);

  const onClose = () => {
    SetIsOpen(false);
  };

  const onOpen = () => {
    SetIsOpen(true);
  };
  return (
    <ComponentCard onOpen={onOpen} title="academic-booking">
      <AcadimicBookingsTable />
      <Modal
        className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}
      >
        <h1 className="flex justify-center p-3  text-3xl">المراحل الدراسية</h1>
        <AddAcademicBooking onClose={onClose} />
      </Modal>
    </ComponentCard>
  );
};

export default AcademicBooking;
