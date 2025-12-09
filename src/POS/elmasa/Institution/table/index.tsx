import { ChangeEvent, useRef, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
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
import UpdateacademicBookingForm from "../updateForm";
import {
  Booking,
  useDeleteAcademicBookingsMutation,
  useGetAcademicBookingsQuery,
} from "../../../../app/features/academicBooking/academicBookingApi";

export default function AcadimicBookingsTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");

  const { data, error, isLoading } = useGetAcademicBookingsQuery({
    page,
    search,
  });

  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<Booking | undefined>();

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const Bookings = data?.data ?? [];
  const total = data?.meta?.total ?? 0;

  const [deleteAcademicBookings] = useDeleteAcademicBookingsMutation();

  const handleDelete = async (id: number | undefined) => {
    if (!id) {
      Swal.fire("خطأ", "رقم الحجز غير صالح", "error");
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
        await deleteAcademicBookings(id).unwrap();
        Swal.fire("تم الحذف!", "تم حذف الحجز بنجاح.", "success");
      } catch (error) {
        Swal.fire("خطأ", `حدث خطأ أثناء الحذف! ${error} `, "error");
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) =>
    SetSearch(e.target.value);

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
                  اسم الطالب
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  اسم المدرس
                </TableCell>
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
                  ميعاد الحجز
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-semibold text-purple-700 text-start"
                >
                  حالة الحجز
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
              {Bookings.map((booking) => (
                <TableRow
                  key={booking.id ?? booking.booking_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell className="px-5 py-4 text-gray-900 dark:text-gray-100 font-medium">
                    {booking.student?.name || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {booking.teacher?.name || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {booking.class_details?.name || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {booking.booking_time
                      ? dayjs(booking.booking_time).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-gray-600 dark:text-gray-400">
                    {booking.status || "-"}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg"
                        onClick={() => {
                          onOpenUp();
                          SetTempCat({
                            ...booking,
                            id: booking.id ?? booking.booking_id,
                          });
                        }}
                      >
                        تعديل
                      </Button>
                      <Button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg"
                        onClick={() =>
                          handleDelete(booking.id ?? booking.booking_id)
                        }
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
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      {/* ✏️ مودال التعديل */}
      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-2xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          تعديل الحجز
        </h1>
        <UpdateacademicBookingForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>
    </>
  );
}
