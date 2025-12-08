import { ChangeEvent, useRef, useState } from "react";
import UpdateacademicStagesForm from "../updateForm";
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
  IAcademicStages,
  useDeleteAcademicStageMutation,
  useGetAcademicStagesQuery,
} from "../../../../app/features/academicStages/academicStagesSlice";

export default function AcadimicStagesTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetAcademicStagesQuery({
    page,
    search,
  });

  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<IAcademicStages | undefined>();

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const AcademicStages = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const [deleteAcademicStage] = useDeleteAcademicStageMutation();

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
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteAcademicStage(id).unwrap();
        Swal.fire("تم الحذف!", "تم الحذف بنجاح.", "success");
      } catch (error) {
        Swal.fire("Error", `Something went wrong! ${error} `, "error");
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        {/* Search */}
        <div className="w-full my-5 px-4">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث عن مرحلة دراسية ..."
            className="h-11 w-full text-center rounded-lg border border-gray-300 bg-transparent py-2.5 px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* Table */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            {/* Header */}
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  اسم المرحلة الدراسية
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  اسم النظام التعليمى
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-center text-sm dark:text-gray-300"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {AcademicStages.map((eduSys) => (
                <TableRow
                  key={eduSys.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <TableCell className="px-5 py-3 font-medium text-gray-900 text-start dark:text-white">
                    {eduSys.name}
                  </TableCell>

                  <TableCell className="px-5 py-3 text-gray-600 text-start dark:text-gray-300">
                    {eduSys.educational_system.name}
                  </TableCell>

                  {/* الإجراءات */}
                  <TableCell className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-2">
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
          <div className="p-4">
            <Paginator page={page} SetPage={SetPage} total={total} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-800 dark:text-white">
          تعديل مرحلة دراسية
        </h1>
        <UpdateacademicStagesForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>
    </>
  );
}
