import { ChangeEvent, useRef, useState } from "react";
import UpdateNewForm from "../updateForm";
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
  INews,
  useDeleteNewMutation,
  useGetNewsQuery,
} from "../../../../app/features/News/newsSlice";

export default function NewsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetNewsQuery({ page, search });
  const [tempCat, SetTempCat] = useState<INews | undefined>();
  const [isOpenUp, SetIsOpenUp] = useState(false);

  const News = data?.data ?? [];
  console.log(News)
  const total = data?.meta?.total ?? 0;
  const [deleteNew] = useDeleteNewMutation();
  const inputRef = useRef<HTMLInputElement>(null);

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    SetSearch(e.target.value);

  const handleDelete = async (id: number | undefined) => {
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
        await deleteNew(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف الخبر بنجاح.", "success");
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
            placeholder="ابحث عن خبر..."
            className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm text-gray-800 shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-100"
          />
        </div>

        {/* الجدول */}

        <div className="hidden sm:block max-w-full overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-gray-50">
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
                  الوصف
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الحالة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الصورة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-center"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100">
              {News.map((newItem) => (
                <TableRow key={newItem.id} className="hover:bg-gray-50">
                  <TableCell className="px-5 py-4 font-medium text-gray-800">
                    {newItem.title}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600">
                    {newItem.content}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600">
                    {newItem.is_published ? "نشط" : "غير نشط"}
                  </TableCell>
                  <TableCell className="px-5 py-4">

                    <img
                      src={
                        newItem.image?.length
                          ? newItem.image
                          : `https://ui-avatars.com/api/?name=${newItem.title}&background=8b5cf6&color=fff`
                      }
                      alt={newItem.title}
                      className="h-16 w-16 object-cover rounded-lg border mx-auto"
                    />
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        className="bg-purple-600 text-white"
                        onClick={() => {
                          onOpenUp();
                          SetTempCat(newItem);
                        }}
                      >
                        تعديل
                      </Button>

                      <Button
                        className="bg-red-600 text-white"
                        onClick={() => handleDelete(newItem?.id)}
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
        {/* بطاقات للشاشات الصغيرة */}
        <div className="sm:hidden space-y-4">
          {News.map((newItem) => (
            <div
              key={newItem.id}
              className="bg-white shadow rounded-lg p-4 flex flex-col gap-2"
            >
              <h2 className="font-semibold text-purple-700">{newItem.title}</h2>
              <p className="text-gray-600 text-sm">{newItem.content}</p>
              <p className="text-gray-600 text-sm">{newItem.is_published ? "نشط" : "غير نشط"}</p>
              <img
                src={
                  newItem.image ||
                  `https://ui-avatars.com/api/?name=${newItem.title}&background=8b5cf6&color=fff`
                }
                alt={newItem.title}
                className="w-full h-40 object-cover rounded-lg border"
              />
              <div className="flex justify-between gap-2">
                <Button
                  className="bg-purple-600 text-white flex-1"
                  onClick={() => {
                    onOpenUp();
                    SetTempCat(newItem);
                  }}
                >
                  تعديل
                </Button>
                <Button
                  className="bg-red-600 text-white flex-1"
                  onClick={() => handleDelete(newItem?.id)}
                >
                  حذف
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* تعديل */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-xl font-bold text-purple-700">
          تعديل خبر
        </h1>
        <UpdateNewForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>
    </>
  );
}
