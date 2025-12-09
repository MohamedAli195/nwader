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

import {
  Institution,
  useDeleteInstitutionMutation,
  useGetInstitutionsQuery,
} from "../../../../app/features/institution/institutionApi";
import UpdateInstitutionForm from "../updateForm";
interface ApiError {
  data?: {
    errors?: Record<string, string[]>;
  };
}
export default function InstitutionsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, error, isLoading } = useGetInstitutionsQuery(page);

  const [isOpenUp, setIsOpenUp] = useState(false);
  const [tempInstitution, setTempInstitution] = useState<Institution | undefined>();

  const onCloseUp = () => setIsOpenUp(false);
  const onOpenUp = () => setIsOpenUp(true);

  const institutions = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [deleteInstitution] = useDeleteInstitutionMutation();

  const handleDelete = async (id: number | undefined) => {
    if (!id) {
      Swal.fire("خطأ", "المؤسسة غير صالحة", "error");
      return;
    }

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

    if (result.isConfirmed) {
      try {
        await deleteInstitution(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف المؤسسة بنجاح.", "success");
      } catch (err: unknown) {
        const error = err as ApiError; // نحدد النوع هنا فقط بعد catch
        Swal.fire(
          "خطأ",
          error?.data?.errors
            ? Object.values(error.data.errors).flat().join("\n")
            : "حدث خطأ غير متوقع",
          "error"
        );
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    setSearch(e.target.value);

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-500">حدث خطأ أثناء جلب البيانات!</p>;

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900">
        {/* 🔍 حقل البحث */}
        <div className="w-full p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث هنا..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* 📋 جدول */}
        <div className="max-w-full overflow-x-auto">
          <Table className="min-w-[700px] sm:min-w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الاسم
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  النوع
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start hidden"
                >
                  البريد الإلكتروني
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start hidden"
                >
                  الهاتف
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الحالة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-center"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {institutions.map((inst) => (
                <TableRow
                  key={inst.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-gray-900 dark:text-gray-100 font-medium">
                    {inst.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {inst.type}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden">
                    {inst.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 hidden">
                    {inst.phone}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 ">
                    {inst.is_active ? "مفعل" : "غير مفعل"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => {
                          onOpenUp();
                          setTempInstitution(inst);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => handleDelete(inst.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 📑 الصفحات */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Paginator page={page} SetPage={setPage} total={total} />
        </div>
      </div>

      {/* ✏️ مودال التعديل */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل المؤسسة
        </h1>
        {tempInstitution && (
          <UpdateInstitutionForm
            onCloseUp={onCloseUp}
            tempInstitution={tempInstitution}
          />
        )}
      </Modal>
    </>
  );
}
