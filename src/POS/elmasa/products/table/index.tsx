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

export default function ProductsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");

  const [tempProduct, SetTempProduct] = useState<IProduct | undefined>();
  const [isOpenUp, SetIsOpenUp] = useState(false);

  // Fetch products
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
      confirmButtonColor: "#9333ea",
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

  if (isLoading) return <p className="p-6">جاري تحميل البيانات...</p>;
  if (error)
    return <p className="p-6 text-red-500">حدث خطأ أثناء جلب البيانات!</p>;

  return (
    <>
      <div className="bg-white shadow rounded-lg p-4 space-y-4">
        {/* البحث */}
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث عن منتج..."
            className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm text-gray-800 shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-100"
          />
        </div>

        {/* الجدول */}
        <div className="hidden sm:block max-w-full overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الاسم
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الوصف
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  السعر
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  رابط المنتج
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الصورة
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-center">
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

        <TableBody className="divide-y divide-gray-100">
  {Products.map((product) => (
    <TableRow key={product.id} className="hover:bg-gray-50">

      <TableCell className="px-5 py-4 text-gray-800 font-medium text-center">
        {product.name}
      </TableCell>

      <TableCell className="px-5 py-4 text-gray-600 text-center">
        {product.description}
      </TableCell>

      <TableCell className="px-5 py-4 text-gray-600 text-center">
        {product.price} ر.س
      </TableCell>

      <TableCell className="px-5 py-4 text-blue-600 underline text-center">
        <Link
          to={product.store_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          رابط المنتج
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
          className="h-16 w-16 object-cover rounded-lg border mx-auto"
        />
      </TableCell>

      <TableCell className="px-5 py-4 text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-2">
          <Button
            className="bg-purple-600 text-white"
            onClick={() => {
              SetTempProduct(product);
              onOpenUp();
            }}
          >
            تعديل
          </Button>

          <Button
            className="bg-red-600 text-white"
            onClick={() => handleDelete(product.id)}
          >
            حذف
          </Button>
        </div>
      </TableCell>

    </TableRow>
  ))}
</TableBody>

          </Table>

          <div className="mt-4">
            <Paginator page={page} SetPage={SetPage} total={total} />
          </div>
        </div>
      </div>

      {/* Modal التعديل */}
      <Modal
        className="w-full lg:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
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
