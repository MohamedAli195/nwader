import { ChangeEvent, useRef, useState } from "react";
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



import UpdateTuitionDiscountForm from "../updateForm"; // 🔹 مكون تعديل الخصم
import { ITuitionDiscount, useDeleteTuitionDiscountMutation, useGetTuitionDiscountsQuery } from "../../../../app/features/TuitionDiscounts/TuitionDiscountsApi";

export default function TuitionDiscountsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempDiscount, SetTempDiscount] = useState<ITuitionDiscount | undefined>();

  const { data, error, isLoading } = useGetTuitionDiscountsQuery({ page, search });
  const [deleteTuitionDiscount] = useDeleteTuitionDiscountMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const discounts = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => SetSearch(e.target.value);

  const handleDelete = async (id: number | undefined) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      buttonsStyling: true,
      reverseButtons: true,
    });

    if (result.isConfirmed && id) {
      try {
        await deleteTuitionDiscount(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف الخصم بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ", `حدث خطأ أثناء الحذف! ${error}`, "error");
      }
    }
  };

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error)
    return <p className="text-red-500">حدث خطأ أثناء جلب بيانات الخصومات!</p>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
        {/* حقل البحث */}
        <div className="w-full p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث عن خصم..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* جدول عرض الخصومات */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  العنوان
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  النسبة %
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  عدد الاستخدامات
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الحالة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-center text-sm dark:text-gray-300"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {discounts.map((discount: ITuitionDiscount) => (
                <TableRow
                  key={discount.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-gray-900 dark:text-gray-100 font-medium">
                    {discount.title}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {discount.discount_percentage}%
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {discount.max_uses ?? "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {discount.is_active ? "نشط" : "غير نشط"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg mx-1"
                      onClick={() => {
                        SetTempDiscount(discount);
                        onOpenUp();
                      }}
                    >
                      تعديل
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg mx-1"
                      onClick={() => handleDelete(discount.id)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* الصفحات */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      {/* مودال تعديل الخصم */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل بيانات الخصم
        </h1>
        <UpdateTuitionDiscountForm onCloseUp={onCloseUp} tempDiscount={tempDiscount} />
      </Modal>
    </>
  );
}
