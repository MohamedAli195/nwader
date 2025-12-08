import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import EdicationalInfoTable from "./table";
import { Modal } from "../../../components/ui/modal";

import AddEducationalContentForm from "./addForm";


const EdicationalInfo = () => {
    const [isOpen, SetIsOpen] = useState(false);
  
    const onClose = () => {
      SetIsOpen(false);
    };
  
    const onOpen = () => {
      SetIsOpen(true);
    };
  return (
    <ComponentCard onOpen={onOpen} title="educational-systems">
      <EdicationalInfoTable />
      <Modal
        className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}
      >
        <h1 className="flex justify-center p-3  text-3xl">اضافة نظام تعليمى</h1>
        <AddEducationalContentForm  onClose={onClose}/>
      </Modal>
    </ComponentCard>
  )
}

export default EdicationalInfo