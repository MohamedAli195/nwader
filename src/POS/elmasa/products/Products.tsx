import { useState } from "react";
import ComponentCard from "../../../components/common/ComponentCard";
import ProductsTable from "./table";
import { Modal } from "../../../components/ui/modal";
import AddProduct from "./addForm";
import { useTranslation } from "react-i18next";


const Products = () => {
    const [isOpen, SetIsOpen] = useState(false);
  const { t } = useTranslation();
    const onClose = () => {
      SetIsOpen(false);
    };
  
    const onOpen = () => {
      SetIsOpen(true);
    };
  return (
    <ComponentCard onOpen={onOpen} title={t("Products")}>
      <ProductsTable />
      <Modal
        className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
        isOpen={isOpen}
        onClose={onClose}
      >
        <h1 className="flex justify-center p-3  text-3xl">اضافة منتج</h1>
        <AddProduct onClose={onClose}/>
      </Modal>
    </ComponentCard>
  )
}

export default Products