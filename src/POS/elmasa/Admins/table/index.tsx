import { ChangeEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { Modal } from "../../../components/ui/modal";
import Paginator from "../../../components/ui/Pagination/Paginator";
import Swal from "sweetalert2";
import {
  IAdmins,
  useDeleteAdminMutation,
  useGetAdminsQuery,
} from "../../../app/features/Admins/AdminsSlice";
import UpdateAdminForm from "../updateForm";
import { useTranslation } from "react-i18next";

export default function AdminsTable() {
  const { t } = useTranslation();
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetAdminsQuery({ page, search });
  
  const [tempAdmin, SetTempAdmin] = useState<IAdmins | undefined>();
  console.log(tempAdmin)
const [isOpenUp, SetIsOpenUp] = useState(false);
  const onCloseUp = () => {
    SetIsOpenUp(false);
  };

  const onOpenUp = () => {
    SetIsOpenUp(true);
  };
  const [isOpenView, SetIsOpenView] = useState(false);
  const onCloseView = () => {
    SetIsOpenView(false);
  };

  const onOpenView = () => {
    SetIsOpenView(true);
  };

  const admins = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0;
console.log(admins)
  const [deleteAdmin] = useDeleteAdminMutation();

  const handleDelete = async (id: number | undefined) => {
    const result = await Swal.fire({
      title: t("deleteConfirmTitle") || "هل أنت متأكد؟",
      text: t("deleteConfirmText") || "لن تتمكن من التراجع عن هذا!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("deleteConfirmYes") || "نعم، احذف",
      cancelButtonText: t("deleteConfirmCancel") || "إلغاء",
      buttonsStyling: true,
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        await deleteAdmin(id).unwrap();
        Swal.fire(
          t("deleted") || "تم الحذف!",
          t("adminDeleted") || "تم حذف المستخدم بنجاح.",
          "success"
        );
      } catch (error) {
        Swal.fire(
          t("error") || "خطأ",
          `${t("errorUnknown") || "حدث خطأ ما"} ${error}`,
          "error"
        );
      }
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearch(e.target.value);
  };

  const exportToExcel = () => {
    const exportData = admins.map((admin) => ({
      [t("name") || "الاسم"]: admin.name,
      [t("email") || "البريد الإلكتروني"]: admin.email,
      [t("permissions") || "الصلاحيات"]:
        admin.permissions?.map((p) => p.display_name).join(", ") || "-",
      [t("store") || "المخزن"]: admin.store?.name || "-",
      [t("phone") || "الموبايل"]: admin.phone || "-",
      
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, t("admins") || "Admins");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "admins.xlsx");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
      <html dir="rtl" lang="ar">
        <head>
          <title>${t("adminsList") || "قائمة المستخدمين"}</title>
          <style>
            body { font-family: sans-serif; direction: rtl; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; font-size: 14px; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h2>${t("adminsList") || "قائمة المستخدمين"}</h2>
          <table>
            <thead>
              <tr>
                <th>${t("name") || "الاسم"}</th>
                <th>${t("email") || "البريد الإلكتروني"}</th>
                <th>${t("permissions") || "الصلاحيات"}</th>
                <th>${t("store") || "المخزن"}</th>
                <th>${t("phone") || "الموبايل"}</th>
                <th>${t("employeeType") || "نوع الموظف"}</th>
              </tr>
            </thead>
            <tbody>
              ${admins
                .map(
                  (a) => `
                <tr>
                  <td>${a.name}</td>
                  <td>${a.email}</td>
                  <td>${
                    a.permissions?.map((p) => p.display_name).join(", ") || "-"
                  }</td>
                  <td>${a.store?.name || "-"}</td>
                  <td>${a.phone || "-"}</td>
           
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  if (isLoading) return <p>{t("loading") || "جاري تحميل البيانات..."}</p>;

  if (error)
    return (
      <p className="text-red-500">
        {t("fetchError") || "حدث خطأ أثناء جلب البيانات!"}
      </p>
    );

  return (
    <>
      <div className="flex justify-end gap-3 mb-4">
        <Button onClick={exportToExcel}>
          {t("excelExport") || "📁 تصدير Excel"}
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700">
          {t("printTable") || "🖨️ طباعة"}
        </Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <input
          value={search}
          onChange={handleSearch}
          ref={inputRef}
          type="text"
          placeholder={t("searchPlaceholder") || "Search or type command..."}
          className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
        />
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("name") || "الاسم"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("email") || "البريد الالكترونى"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("permissions") || "الصلاحيات"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("store") || "المخزن"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("phone") || "الموبيل"}
                </TableCell>
          
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("baseSalary") || "الراتب الأساسي"}
                </TableCell> */}
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("hourlyRate") || "أجر الساعة"}
                </TableCell> */}
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("workStart") || "بداية الدوام"}
                </TableCell> */}
                {/* <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("workEnd") || "نهاية الدوام"}
                </TableCell> */}
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("workDays") || "أيام العمل"}
                </TableCell>

                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("العمليات") || "العمليات"}
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {admins.map((admin: IAdmins) => (
                <TableRow key={admin.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {admin.name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.role && admin.role.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {admin.role.map((r) => (
                          <span
                            key={r}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full shadow-sm">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.store.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.phone}
                  </TableCell>
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.base_salary ?? "-"}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.hourly_rate ?? "-"}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.work_start_time ?? "-"}
                  </TableCell> */}
                  {/* <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.work_end_time ?? "-"}
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {admin.work_days && admin.work_days.length > 0
                      ? admin.work_days.join(", ")
                      : "-"}
                  </TableCell>

                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => {
                          onOpenUp();
                          SetTempAdmin(admin);
                        }}>
                        {t("edit") || "تعديل"}
                      </Button>
                      <Button
                        onClick={() => {
                          onOpenView();
                          SetTempAdmin(admin);
                        }}>
                        { "عرض"}
                      </Button>
                      <Button
                        className="bg-red-500"
                        onClick={() => handleDelete(admin?.id)}>
                        {t("delete") || "حذف"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginator page={page} SetPage={SetPage} total={total} />
        </div>
      </div>

      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}>
        <h1 className="flex justify-center p-3 text-3xl">
          {t("updateAdminTitle") || "تعديل مستخدم"}
        </h1>
        <UpdateAdminForm onCloseUp={onCloseUp} tempAdmin={tempAdmin} />
      </Modal>

      <Modal
        className="w-full lg:w-4/12 xl:w-4/12 h-auto relative rounded-3xl bg-white dark:bg-gray-900"
        isOpen={isOpenView}
        onClose={onCloseView}>
        <h1 className="flex justify-center p-3 text-3xl">
          {"عرض مستخدم"}
        </h1>
        
         <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 my-6">
      <h2 className="text-2xl font-bold mb-4">معلومات المدير</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-semibold text-gray-600">الاسم:</p>
          <p className="text-gray-800">{tempAdmin?.name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">البريد الالكتروني:</p>
          <p className="text-gray-800">{tempAdmin?.email}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">رقم الهاتف:</p>
          <p className="text-gray-800">{tempAdmin?.phone}</p>
        </div>
        {/* <div>
          <p className="font-semibold text-gray-600">نوع المستخدم:</p>
          <p className="text-gray-800">{tempAdmin?.type}</p>
        </div> */}
        <div>
          <p className="font-semibold text-gray-600">المخزن:</p>
          <p className="text-gray-800">{tempAdmin?.store?.name}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">الراتب الأساسي:</p>
          <p className="text-gray-800">{tempAdmin?.base_salary}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">الأجر بالساعة:</p>
          <p className="text-gray-800">{tempAdmin?.hourly_rate}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">الرولز:</p>
          <p className="text-gray-800">{tempAdmin?.role.join(", ")}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold text-gray-600">أيام العمل:</p>
          <p className="text-gray-800">{tempAdmin?.work_days?.join(", ")}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">وقت البداية:</p>
          <p className="text-gray-800">{tempAdmin?.work_start_time}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-600">وقت النهاية:</p>
          <p className="text-gray-800">{tempAdmin?.work_end_time}</p>
        </div>
      </div>

      {/* <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">الصلاحيات:</h3>
        <ul className="list-disc list-inside text-gray-800">
          {tempAdmin.permissions?.map((perm, idx) => (
            <li key={idx}>{perm.name}</li>
          ))}
        </ul>
      </div> */}
    </div>
      </Modal>
    </>
  );
}
