import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import Button from "../../../components/ui/button/Button";
import { ChangeEvent, useRef, useState } from "react";
import { Modal } from "../../../components/ui/modal";
import UpdateRoleForm from "../UpdateBrand";
import Paginator from "../../../components/ui/Pagination/Paginator";
import Swal from "sweetalert2";
import { useAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";
import { checkPermissions } from "../../../functions";
import { useTranslation } from "react-i18next";
import { IRole, useDeleteRoleMutation, useGetRolesQuery } from "../../../app/features/roles/roles";

const RolesTable = () => {
  const { t } = useTranslation();
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<IRole>();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    SetSearch(e.target.value);
  };

  const onCloseUp = () => SetIsOpenUp(false);
  const onOpenUp = () => SetIsOpenUp(true);

  const [deleteRole] = useDeleteRoleMutation();
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
        await deleteRole(id).unwrap();
        Swal.fire(
          t("deleted") || "تم الحذف!",
          t("deleteSuccessText") || "تم حذف العلامة التجارية بنجاح.",
          "success"
        );
      } catch (error) {
        const err = error as FetchBaseQueryError;
        console.log(err)
        Swal.fire(
          t("error") || "خطأ",
          (err.data as string) || t("errorUnknown") || "حدث خطأ غير معروف.",
          "error"
        );
      }
    }
  };

  const {
    data: roles,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useGetRolesQuery();

  const permissions = useAppSelector(
    (state: RootState) => state.auth.user?.permissions
  );

  const roless = roles?.data?.data ?? [];
  const total = roles?.data?.total ?? 0;

  // const handleExportExcel = () => {
  //   if (!brandss.length) return;

  //   const formatted = brandss.map((b) => ({
  //     [t("id") || "الرقم"]: b.id,
  //     [t("tableName") || "الاسم"]: b.name,
  //     [t("tableNotes") || "الملاحظات"]: b.notes || "-",
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(formatted);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, t("brands") || "Brands");
  //   XLSX.writeFile(workbook, "brands.xlsx");
  // };

  // const handlePrint = () => {
  //   if (!brandss.length) return;

  //   const printContent = `
  //     <html dir="rtl" lang="ar">
  //       <head>
  //         <title>${t("brands") || "العلامات التجارية"}</title>
  //         <style>
  //           body { font-family: sans-serif; direction: rtl; }
  //           table { width: 100%; border-collapse: collapse; margin-top: 20px; }
  //           th, td { border: 1px solid #000; padding: 8px; text-align: center; }
  //           th { background: #f0f0f0; }
  //         </style>
  //       </head>
  //       <body>
  //         <h2 style="text-align:center">${
  //           t("brandsList") || "قائمة العلامات التجارية"
  //         }</h2>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>${t("id") || "الرقم"}</th>
  //               <th>${t("tableName") || "الاسم"}</th>
  //               <th>${t("tableNotes") || "الملاحظات"}</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             ${brandss
  //               .map(
  //                 (b) => `
  //               <tr>
  //                 <td>${b.id}</td>
  //                 <td>${b.name}</td>
  //                 <td>${b.notes || "-"}</td>
  //               </tr>
  //             `
  //               )
  //               .join("")}
  //           </tbody>
  //         </table>
  //       </body>
  //     </html>
  //   `;

  //   const printWindow = window.open("", "_blank");
  //   if (printWindow) {
  //     printWindow.document.write(printContent);
  //     printWindow.document.close();
  //     printWindow.print();
  //   }
  // };

  if (isLoading) return <h2>{t("loading") || "Loading..."}</h2>;

  if (isError) {
    let errorMessage = t("errorUnknown") || "حدث خطأ ما";

    if ("status" in error) {
      const err = error as FetchBaseQueryError;

      if (
        typeof err.data === "string" &&
        err.data.startsWith("<!DOCTYPE html")
      ) {
        errorMessage =
          t("serverError") || "البيانات غير موجودة أو حدث خطأ من السيرفر.";
      } else {
        errorMessage =
          typeof err.data === "string"
            ? err.data
            : (err.data as { message?: string })?.message ||
              `HTTP error: ${err.status}`;
      }
    } else {
      const err = error as SerializedError;
      errorMessage = err.message || t("errorUnknown") || "حدث خطأ غير معروف.";
    }

    return <div className="text-red-500 p-4">{errorMessage}</div>;
  }

  if (!isSuccess || !roles) {
    return (
      <div className="text-red-500 p-4">
        {t("noData") || "لا توجد بيانات لعرضها."}
      </div>
    );
  }

  return (
    <>
      {/* <div className="flex justify-end gap-3 mb-4">
        <Button onClick={handleExportExcel}>
          {t("excelExport") || "📁 تصدير Excel"}
        </Button>
        <Button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700">
          {t("printTable") || "🖨️ طباعة"}
        </Button>
      </div> */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <input
          value={search}
          onChange={handleSearch}
          ref={inputRef}
          type="text"
          placeholder={t("searchPlaceholder") || "Search or type command..."}
          className="dark:bg-dark-900 h-11 !w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
        />
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("brandName") || "اسم صلاحية المستخدم"}
                </TableCell>
          <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("brandName") || "الصلاحيات"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("tableActions") || "عمليات"}
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {isSuccess &&
                roless.map((role: IRole) => (
                  <TableRow key={role.id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {role.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {role.permissions && role.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {role.permissions.map((perm) => (
                          <span
                            key={perm.id}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full shadow-sm">
                            {perm.display_name}
                          </span>
                        ))}
                      </div>
                    )}
                  </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="flex space-x-4">
                        {checkPermissions(permissions, "edit-brand") && (
                          <Button
                            onClick={() => {
                              onOpenUp();
                              SetTempCat(role);
                            }}>
                            {t("edit") || "تعديل"}
                          </Button>
                        )}
                        {checkPermissions(permissions, "delete-brand") && (
                          <Button
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleDelete(role?.id)}>
                            {t("delete") || "حذف"}
                          </Button>
                        )}
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
          {"تعديل الدور"}
        </h1>
{tempCat && <UpdateRoleForm role={tempCat} onClose={onCloseUp} />}
      </Modal>
    </>
  );
};

export default RolesTable;
