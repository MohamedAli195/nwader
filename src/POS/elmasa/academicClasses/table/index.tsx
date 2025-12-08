import { ChangeEvent, useRef, useState } from "react";
import UpdateacademicClassesForm from "../updateForm";
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
  IAcademicClasses,
  useDeleteAcademicClassesMutation,
  useGetAcademicClassesQuery,
} from "../../../../app/features/academicClasses/academicClassesSlice";

export default function AcadimicClassesTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetAcademicClassesQuery({
    page,
    search,
  });

  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<IAcademicClasses | undefined>();

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const AcademicYears = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [deleteAcademicClasses] = useDeleteAcademicClassesMutation();

  const handleDelete = async (id: number | undefined) => {
    const result = await Swal.fire({
      title: "هل أنت متأكد؟",
      text: "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم، احذف",
      cancelButtonText: "إلغاء",
      buttonsStyling: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteAcademicClasses(id).unwrap();
        Swal.fire("تم الحذف!", "تم الحذف بنجاح.", "success");
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Search Bar */}
        <div className="w-full my-5 px-4">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث هنا ..."
            className="dark:bg-dark-900 h-11 w-full text-center rounded-lg border border-gray-200 bg-transparent py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/40 dark:focus:border-brand-600"
          />
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-gray-800/30">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  اسم المادة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  اسم الصف الدراسى
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-center text-sm dark:text-gray-300"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {AcademicYears.map((eduSys) => (
                <TableRow
                  key={eduSys.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                >
                  <TableCell className="px-5 py-3 font-medium text-gray-800 dark:text-white/90">
                    {eduSys.name}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-sm dark:text-gray-400">
                    {eduSys.academic_year.name}
                  </TableCell>

                  {/* الإجراءات */}
                  <TableCell className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => {
                          onOpenUp();
                          SetTempCat(eduSys);
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => handleDelete(eduSys?.id)}
                      >
                        حذف
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      {/* Modal */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold">
          تعديل المادة
        </h1>
        <UpdateacademicClassesForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>
    </>
  );
}
