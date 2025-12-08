import { ChangeEvent, useRef, useState } from "react";



import Swal from "sweetalert2";

import UpdateAdminForm from "../updateForm";
import { useTranslation } from "react-i18next";
import { IAdmins, useDeleteAdminMutation, useGetAdminsQuery } from "../../../../app/features/Admins/AdminsSlice";
import Button from "../../../../components/ui/button/Button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../../components/ui/table";
import Paginator from "../../../../components/ui/Pagination/Paginator";
import { Modal } from "../../../../components/ui/modal";

export default function AdminsTable() {
  const { t } = useTranslation();
  const [page, SetPage] = useState(1);
  const per_page = 15;
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetAdminsQuery({ per_page, search });
  
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

  const admins = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
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
                  {t("name") || "اسم الحساب"}
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  {t("email") || "البريد الالكترونى"}
                </TableCell>


          
                
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  { "الرولز"}
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
                    {admin.username}
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
          <div>
          <p className="font-semibold text-gray-600">اسم الحساب:</p>
          <p className="text-gray-800">{tempAdmin?.username}</p>
        </div>
        <div></div>
          <p className="font-semibold text-gray-600">البريد الالكتروني:</p>
          <p className="text-gray-800">{tempAdmin?.email}</p>
        </div>


    
      </div>


    </div>
      </Modal>
    </>
  );
}
