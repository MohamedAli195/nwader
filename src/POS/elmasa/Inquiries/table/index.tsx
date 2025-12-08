import { ChangeEvent, useRef, useState } from "react";
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
import UpdateNewForm from "../updateForm";
import { Link } from "react-router";
import AddReplay from "../addForm";
import {
  Iinquiries,
  useGetInquiriesQuery,
} from "../../../../app/features/inquiries/inquiriesSlice";

export default function InquiriesTable() {
  const [isOpenAdd, SetIsOpenAdd] = useState(false);
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetInquiriesQuery();

  const [tempCat, SetTempCat] = useState<Iinquiries | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);

  const Inquiries = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const onCloseAdd = () => SetIsOpenAdd(false);
  const onOpenAdd = () => SetIsOpenAdd(true);

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    SetSearch(e.target.value);

  const statusStyles: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "قيد الانتظار",
    },
    progress: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "قيد المعالجة",
    },
    answered: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "تم الحل",
    },
    closed: {
      bg: "bg-gray-100",
      text: "text-gray-700",
      label: "مغلقة",
    },
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
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400"
          />
        </div>

        {/* جدول */}
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  العنوان
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الاستفسار
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
                  مرسلة من
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  نوع المرسل
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
              {Inquiries.map((inq) => (
                <TableRow
                  key={inq.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-start text-gray-900 dark:text-gray-100 font-medium">
                    {inq?.subject}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                    {inq?.message}
                  </TableCell>
                  <TableCell
                    className={`px-5 py-4 text-start font-semibold rounded-lg 
                      ${statusStyles[inq?.status || "pending"]?.bg} 
                      ${statusStyles[inq?.status || "pending"]?.text}`}
                  >
                    {statusStyles[inq?.status || "pending"]?.label}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                    {inq?.author?.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                    {inq?.author?.type}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center space-x-2">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                      onClick={() => {
                        onOpenUp();
                        SetTempCat(inq);
                      }}
                    >
                      تعديل
                    </Button>
                    <Link to={`/inquiries/${inq.id}`}>
                      <Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg mx-1">
                        تفاصيل
                      </Button>
                    </Link>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg mx-1"
                      onClick={() => {
                        onOpenAdd();
                        SetTempCat(inq);
                      }}
                    >
                      رد
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* صفحات */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      {/* مودال التعديل */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل الاستفسار
        </h1>
        <UpdateNewForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>

      {/* مودال الرد */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenAdd}
        onClose={onCloseAdd}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          رد على الاستفسار
        </h1>
        <AddReplay tempCat={tempCat} onClose={onCloseAdd} />
      </Modal>
    </>
  );
}
