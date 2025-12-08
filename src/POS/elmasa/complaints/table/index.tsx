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
import {
  IComplaint,
  useGetComplaintsQuery,
} from "../../../../app/features/complaints/complaintsSlice";
import UpdateNewForm from "../updateForm";
import { Link } from "react-router";
import AddReplay from "../addForm";

export default function ComplaintsTable() {
  const [isOpenAdd, SetIsOpenAdd] = useState(false);
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<IComplaint | undefined>();
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, error, isLoading } = useGetComplaintsQuery();
  const Complaints = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearch(e.target.value);
  };

  const statusStyles: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "قيد الانتظار",
    },
    in_progress: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "قيد المعالجة",
    },
    resolved: { bg: "bg-green-100", text: "text-green-700", label: "تم الحل" },
    closed: { bg: "bg-gray-100", text: "text-gray-700", label: "مغلقة" },
  };

  if (isLoading) return <p className="p-6">جاري تحميل البيانات...</p>;
  if (error)
    return <p className="p-6 text-red-500">حدث خطأ أثناء جلب البيانات!</p>;

  return (
    <>
      {/* الجدول للشاشات الكبيرة */}
      <div className="hidden sm:block bg-white shadow rounded-lg p-4 space-y-4">
        {/* البحث */}
        <div className="flex items-center gap-3 mb-4">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث عن شكوى..."
            className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm text-gray-800 shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-100"
          />
        </div>

        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
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
                  الشكوى
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
                  مرسلة من الطالب
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  الإجراءات
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100">
              {Complaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-gray-50">
                  <TableCell className="px-5 py-4 font-medium text-gray-800">
                    {complaint.subject}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600">
                    {complaint.message}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        statusStyles[complaint.status || "pending"].bg
                      } ${statusStyles[complaint.status || "pending"].text}`}
                    >
                      {statusStyles[complaint.status || "pending"].label}
                    </span>
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600">
                    {complaint.submitted_by_student?.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 flex flex-wrap gap-2">
                    <Button
                      className="bg-purple-600 text-white"
                      onClick={() => {
                        SetIsOpenUp(true);
                        SetTempCat(complaint);
                      }}
                    >
                      تعديل
                    </Button>
                    <Link to={`/complaints/${complaint.id}`}>
                      <Button className="bg-yellow-500 text-white">
                        تفاصيل
                      </Button>
                    </Link>
                    <Button
                      className="bg-green-600 text-white"
                      onClick={() => {
                        SetIsOpenAdd(true);
                        SetTempCat(complaint);
                      }}
                    >
                      رد
                    </Button>
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

      {/* البطاقات للشاشات الصغيرة */}
      <div className="sm:hidden flex flex-col gap-4 p-3">
        <input
          value={search}
          onChange={handleSearch}
          ref={inputRef}
          type="text"
          placeholder="ابحث عن شكوى..."
          className="w-full h-11 rounded-lg border border-gray-300 px-4 text-sm text-gray-800 shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-100 mb-4"
        />
        {Complaints.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 flex flex-col gap-3"
          >
            <h2 className="font-semibold text-purple-700">
              {complaint.subject}
            </h2>
            <p className="text-gray-600">{complaint.message}</p>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full w-max ${
                statusStyles[complaint.status || "pending"].bg
              } ${statusStyles[complaint.status || "pending"].text}`}
            >
              {statusStyles[complaint.status || "pending"].label}
            </span>
            <p className="text-gray-600 text-sm">
              مرسلة من: {complaint.submitted_by_student?.name}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Button
                className="bg-purple-600 flex-1 text-white"
                onClick={() => {
                  SetIsOpenUp(true);
                  SetTempCat(complaint);
                }}
              >
                تعديل
              </Button>
              <Link to={`/complaints/${complaint.id}`} className="flex-1">
                <Button className="bg-yellow-500 text-white w-full">
                  تفاصيل
                </Button>
              </Link>
              <Button
                className="bg-green-600 flex-1 text-white"
                onClick={() => {
                  SetIsOpenAdd(true);
                  SetTempCat(complaint);
                }}
              >
                رد
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* مودالات تعديل ورد */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={() => SetIsOpenUp(false)}
      >
        <h1 className="flex justify-center p-3 text-xl font-bold text-purple-700">
          تعديل شكوى
        </h1>
        <UpdateNewForm onCloseUp={() => SetIsOpenUp(false)} tempCat={tempCat} />
      </Modal>

      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenAdd}
        onClose={() => SetIsOpenAdd(false)}
      >
        <h1 className="flex justify-center p-3 text-xl font-bold text-green-700">
          رد على الشكوى
        </h1>
        <AddReplay tempCat={tempCat} onClose={() => SetIsOpenAdd(false)} />
      </Modal>
    </>
  );
}
