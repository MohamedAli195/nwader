import { ChangeEvent, useRef, useState } from "react";
import UpdateProductForm from "../updateForm";
import Swal from "sweetalert2";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../../components/ui/table";
import Button from "../../../../components/ui/button/Button";
import Paginator from "../../../../components/ui/Pagination/Paginator";
import { Modal } from "../../../../components/ui/modal";

import {
  useGetProductsQuery,
  useDeleteProductMutation,
  IProduct,
} from "../../../../app/features/products/productsSlice";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ProductsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
const { t } = useTranslation();
  const [tempProduct, SetTempProduct] = useState<IProduct | undefined>();
  const [isOpenUp, SetIsOpenUp] = useState(false);

  const { data, isLoading, error } = useGetProductsQuery({
    page,
    per_page: 15,
  });

  const Products = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [deleteProduct] = useDeleteProductMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    SetSearch(e.target.value);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7c3aed",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      buttonsStyling: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteProduct(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف المنتج بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ", `حدثت مشكلة! ${error} `, "error");
      }
    }
  };

  if (isLoading)
    return <p className="p-6 text-purple-700 font-semibold">جاري تحميل البيانات...</p>;
  if (error)
    return <p className="p-6 text-red-500 font-semibold">حدث خطأ أثناء جلب البيانات!</p>;

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-6 space-y-6 border border-gray-100">

        {/* 🔍 مربع البحث */}
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder={t("search")}
            className="w-full h-12 rounded-xl border border-gray-200 px-4 text-sm text-gray-800 shadow-sm transition focus:border-purple-500 focus:ring focus:ring-purple-100 bg-gray-50"
          />
        </div>

        {/* 📦 جدول المنتجات */}
        <div className="hidden sm:block max-w-full overflow-x-auto">
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow className="bg-purple-50">
                <TableCell isHeader className="px-5 py-3 font-bold text-purple-700">{t("product Name")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-purple-700">{t("Description")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-purple-700">{t("Price")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-purple-700">{t("Product Link")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-purple-700">{t("Image")}</TableCell>
                <TableCell isHeader className="px-5 py-3 font-bold text-center text-purple-700">
                  {t("Actions")}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {Products.map((product) => (
                <TableRow
                  key={product.id}
                  className="hover:bg-purple-50/40 transition cursor-pointer"
                >
                 <TableCell
  className="
    px-5 py-4
    text-gray-800 font-medium
    leading-relaxed    
    whitespace-pre-wrap  
    text-center
    break-words       
    max-w-xs md:max-w-sm lg:max-w-md"

>
  {product.name}
</TableCell>


               <TableCell
  className="
    px-5 py-4
     text-center  
    text-gray-600
    leading-relaxed
    whitespace-pre-wrap
    break-words
    max-w-xs md:max-w-sm lg:max-w-lg
  "
>
  {product.description}
</TableCell>

                  <TableCell className="px-5 py-4 text-gray-700 font-medium text-center">
                    {product.price} ر.س
                  </TableCell>

                  <TableCell className="px-5 py-4 text-blue-600 underline text-center">
                    <Link
                      to={product.store_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-700"
                    >
                      {t("Product Link")}
                    </Link>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-center">
                    <img
                      src={
                        product.images?.length
                          ? product.images[0]
                          : `https://ui-avatars.com/api/?name=${product.name}&background=8b5cf6&color=fff`
                      }
                      alt={product.name}
                      className="h-16 w-16 object-cover rounded-xl border mx-auto shadow"
                    />
                  </TableCell>

                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-3">

                      <Button
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl shadow-md"
                        onClick={() => {
                          SetTempProduct(product);
                          onOpenUp();
                        }}
                      >
                        {t("Edit")}
                      </Button>

                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl shadow-md"
                        onClick={() => handleDelete(product.id)}
                      >
                          {t("Delete")}
                      </Button>

                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6">
            <Paginator page={page} SetPage={SetPage} total={total} />
          </div>
        </div>
      </div>

      {/* 🟣 Modal التعديل */}
      <Modal
        className="w-full lg:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-5 border border-purple-100"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-xl font-bold text-purple-700">
          تعديل منتج
        </h1>

        <UpdateProductForm tempProduct={tempProduct} onCloseUp={onCloseUp} />
      </Modal>
    </>
  );
}
