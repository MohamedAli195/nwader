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
  IStudents,
  useDeleteAcademicStudentsMutation,
  useGetAcademicStudentsQuery,
} from "../../../../app/features/academicStudent/academicStudentApi";
import UpdateacademicStudentsForm from "../updateForm";

export default function AcadimicStudentsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");

  const { data, error, isLoading } = useGetAcademicStudentsQuery({
    page,
    search,
  });

  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<IStudents | undefined>();
  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const Students = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [deleteAcademicStudents] = useDeleteAcademicStudentsMutation();

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

    if (result.isConfirmed) {
      try {
        await deleteAcademicStudents(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف الطالب بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ", `حدث خطأ ما! ${error} `, "error");
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearch(e.target.value);
  };

  if (isLoading) return <p>جاري تحميل البيانات...</p>;
  if (error) return <p className="text-red-500">حدث خطأ أثناء جلب البيانات!</p>;

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
            placeholder="ابحث هنا..."
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 
              focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 
              dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* جدول - يظهر في الشاشات المتوسطة فأعلى */}
        <div className="max-w-full overflow-x-auto hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  الاسم الكامل
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  رقم الهاتف
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  البريد الإلكتروني
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  تاريخ الميلاد
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  رقم الطالب
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-start">
                  تاريخ التسجيل
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-semibold text-purple-700 text-center text-sm dark:text-gray-300">
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {Students.map((student) => (
                <TableRow
                  key={student.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-start text-gray-900 dark:text-gray-100 font-medium">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 text-start">
                    {student.phone}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 text-start">
                    {student.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 text-start">
                    {student.date_of_birth}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 text-start">
                    {student.student_id}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400 text-start">
                    {student.registered_at}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => {
                          onOpenUp();
                          SetTempCat(student);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => handleDelete(student?.id)}
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

        {/* نسخة الموبايل - كروت */}
        <div className="block md:hidden p-4 space-y-4">
          {Students.map((student) => (
            <div
              key={student.id}
              className="rounded-lg border border-gray-200 p-4 dark:border-gray-700 dark:bg-gray-800 shadow-sm"
            >
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                {student.first_name} {student.last_name}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {student.phone}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {student.email}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {student.date_of_birth} | {student.student_id}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {student.registered_at}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto px-3 py-1 rounded-lg"
                  onClick={() => {
                    onOpenUp();
                    SetTempCat(student);
                  }}
                >
                  تعديل
                </Button>
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto px-3 py-1 rounded-lg"
                  onClick={() => handleDelete(student?.id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* صفحات */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      {/* مودال التعديل */}
      <Modal
        className="w-full md:w-8/12 lg:w-6/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل الطالب
        </h1>
        <UpdateacademicStudentsForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>
    </>
  );
}
