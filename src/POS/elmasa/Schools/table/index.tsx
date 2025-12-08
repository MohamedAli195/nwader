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



import UpdateSchoolForm from "../updateForm"; // ✅ مكون تعديل المدرسة
import { ISchool, useDeleteSchoolMutation, useGetSchoolsQuery } from "../../../../app/features/schools/schoolsApi";

export default function SchoolsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempSchool, SetTempSchool] = useState<ISchool | undefined>();

  const { data, error, isLoading } = useGetSchoolsQuery({ page, search });
  const [deleteSchool] = useDeleteSchoolMutation();

  const inputRef = useRef<HTMLInputElement>(null);

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const schools = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    SetSearch(e.target.value);

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
        await deleteSchool(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف المدرسة بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ", `حدث خطأ أثناء الحذف! ${error}`, "error");
      }
    }
  };

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error)
    return <p className="text-red-500">حدث خطأ أثناء جلب بيانات المدارس!</p>;

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
            placeholder="ابحث عن مدرسة..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* جدول عرض المدارس */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الاسم
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  المحافظة
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  النوع
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700">
                  الهاتف
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
              {schools.map((school: ISchool) => (
                <TableRow
                  key={school.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-gray-900 dark:text-gray-100 font-medium">
                    {school.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {school.governorate || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {school.type || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {school.phone || "-"}
                  </TableCell>

                  <TableCell className="px-5 py-4 text-center">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg mx-1"
                      onClick={() => {
                        SetTempSchool(school);
                        onOpenUp();
                      }}
                    >
                      تعديل
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg mx-1"
                      onClick={() => handleDelete(school.id)}
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

      {/* مودال تعديل المدرسة */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل بيانات المدرسة
        </h1>
        <UpdateSchoolForm onCloseUp={onCloseUp} tempSchool={tempSchool} />
      </Modal>
    </>
  );
}
