import { ChangeEvent, useRef, useState } from "react";
import Select from "react-select";
import UpdateTeatcherForm from "../updateForm";

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
  ITeacher,
  useConfirmTeatcherMutation,
  useDeleteTeatcherMutation,
  useGetTeatchersQuery,
  useRegisterClassMutation,
} from "../../../../app/features/teachers/teachersSlice";
import { useGetAcademicClassesQuery } from "../../../../app/features/academicClasses/academicClassesSlice";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../../../components/form/input/InputField";
import { errorType } from "../../../../types";
type Option = {
  label: string;
  value: string | number;
};

export interface IFormInputRigisterClasses {
  class_id: number;
  class_price: string;
  currency?: string;
}
export default function TeachersTable() {
  const [page, SetPage] = useState(1);
  const [search, SetSearch] = useState("");
  const { data, error, isLoading } = useGetTeatchersQuery({ page, search });
  const [tempID, SetTempID] = useState(0);
  const [registerClass] = useRegisterClassMutation();
  const { data: classesdata, isLoading: isLoadingClass } =
    useGetAcademicClassesQuery({
      page: 1,
      search: "",
    });

  const classes = classesdata?.data ?? [];

  const ClassesOptions: Option[] =
    classes?.map((classItem) => ({
      value: classItem.id?.toString() || "",
      label: classItem.name,
    })) || [];

  const currencyOptions: Option[] = [
    { value: "EGP", label: "جنيه مصري" },
    { value: "USD", label: "دولار أمريكي" },
    { value: "EUR", label: "يورو" },
    { value: "SAR", label: "ريال سعودي" },
  ];

  const { register, handleSubmit, control } =
    useForm<IFormInputRigisterClasses>();
  const onSubmit: SubmitHandler<IFormInputRigisterClasses> = async (data) => {
    const formData = new FormData();
    formData.append("class_id", String(data.class_id));
    formData.append("class_price", String(data.class_price));
    formData.append("currency", data.currency || "EGP");
    try {
      const id = tempID;
      await registerClass({ id, body: formData }).unwrap(); // This will throw if there's an error
      Swal.fire("تم ", "تم بنجاح", "success");
    } catch (error: unknown) {
      const err = error as errorType;

      Swal.fire(
        "Error",
        err?.data?.errors?.name
          ? err.data.errors.name.join("\n")
          : "Something went wrong",
        "error"
      );
    }
    onClose();
  };
  const [isOpenUp, SetIsOpenUp] = useState(false);
  const [tempCat, SetTempCat] = useState<ITeacher | undefined>();
  const [isOpen, SetIsOpen] = useState(false);
  const onCloseUp = () => {
    SetIsOpenUp(false);
  };

  const onOpenUp = () => {
    SetIsOpenUp(true);
  };

  const onClose = () => {
    SetIsOpen(false);
  };

  const onOpen = () => {
    SetIsOpen(true);
  };
  const Teachers = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const [deleteTeatcher] = useDeleteTeatcherMutation();
  const [confirmTeatcher, { data: con }] = useConfirmTeatcherMutation();
  console.log(con);
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
      reverseButtons: true, // لجعل زر النعم على اليمين (اختياري)
    });

    if (result.isConfirmed) {
      try {
        await deleteTeatcher(id).unwrap();
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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Search Box */}
        <div className="w-full my-5 px-3 sm:px-6">
          <input
            value={search}
            onChange={handleSearch}
            ref={inputRef}
            type="text"
            placeholder="ابحث هنا..."
            className="dark:bg-dark-900 h-11 w-full text-center rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-90 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[0]">
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  الاسم
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  رقم المحمول
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  الصورة
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  التأكيد
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  حجز مواد المدرس
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  تعديل
                </TableCell>
                <TableCell
                  isHeader
                  className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 text-start dark:text-gray-400"
                >
                  حذف
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {Teachers.map((teatcher) => (
                <TableRow
                  key={teatcher.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  {/* الاسم */}
                  <TableCell className="px-4 py-3 text-sm sm:text-base font-medium text-gray-800 dark:text-white">
                    {teatcher.name}
                  </TableCell>

                  {/* الموبايل */}
                  <TableCell className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                    {teatcher.phone}
                  </TableCell>

                  {/* الصورة */}
                  <TableCell className="px-4 py-3">
                    <img
                      src={
                        teatcher.image_url ||
                        `https://ui-avatars.com/api/?name=${teatcher.name}&background=8b5cf6&color=fff`
                      }
                      alt={teatcher.name}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border"
                    />
                  </TableCell>

                  {/* التأكيد */}
                  <TableCell className="px-4 py-3">
                    {!teatcher.is_confirmed ? (
                      <Button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs sm:text-sm"
                        onClick={() => confirmTeatcher(teatcher.id)}
                      >
                        تأكيد
                      </Button>
                    ) : (
                      <span className="text-green-600 font-semibold text-xs sm:text-sm">
                        تم التأكيد
                      </span>
                    )}
                  </TableCell>

                  {/* حجز المواد */}
                  <TableCell className="px-4 py-3">
                    <Button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 text-xs sm:text-sm"
                      onClick={() => {
                        onOpen();
                        SetTempID(teatcher.id);
                      }}
                    >
                      حجز
                    </Button>
                  </TableCell>

                  {/* تعديل */}
                  <TableCell className="px-4 py-3">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 text-xs sm:text-sm"
                      onClick={() => {
                        onOpenUp();
                        SetTempCat(teatcher);
                      }}
                    >
                      تعديل
                    </Button>
                  </TableCell>

                  {/* حذف */}
                  <TableCell className="px-4 py-3">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs sm:text-sm"
                      onClick={() => handleDelete(teatcher?.id)}
                    >
                      حذف
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="px-3 sm:px-6">
            <Paginator page={page} SetPage={SetPage} total={total} />
          </div>
        </div>
      </div>

      <Modal
        className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
        isOpen={isOpenUp}
        onClose={onCloseUp}
      >
        <h1 className="flex justify-center p-3  text-3xl">تعديل معلم</h1>
        <UpdateTeatcherForm onCloseUp={onCloseUp} tempCat={tempCat} />
      </Modal>

      {/* register class */}
      <Modal
        className="w-full max-w-lg h-auto relative rounded-3xl bg-white dark:bg-gray-900 p-6 shadow-lg"
        isOpen={isOpen}
        onClose={onClose}
      >
        {/* العنوان */}
        <h1 className="text-center text-2xl font-bold mb-6">إضافة مادة</h1>

        {/* الفورم */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          {/* حقل اختيار النظام التعليمي */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              اسم النظام التعليمي
            </label>
            <Controller
              control={control}
              name="class_id"
              render={({ field }) => (
                <Select<Option, false>
                  {...field}
                  options={ClassesOptions}
                  isClearable
                  className="w-full"
                  isLoading={isLoadingClass}
                  placeholder="اسم النظام التعليمي"
                  onChange={(val) => field.onChange(val?.value ?? null)}
                  value={ClassesOptions.find(
                    (opt) => opt.value === field.value
                  )}
                />
              )}
            />
          </div>

          {/* حقل السعر */}
          <div>
            <label className="block mb-2 text-sm font-medium">سعر المادة</label>
            <Input
              type="text"
              className="w-full"
              {...register("class_price", { required: "حقل الاسم مطلوب" })}
            />
          </div>
          {/* حقل اختيار العملة */}
          <div>
            <label className="block mb-2 text-sm font-medium">العملة</label>
            <Controller
              control={control}
              name="currency"
              render={({ field }) => (
                <Select<Option, false>
                  {...field}
                  options={currencyOptions}
                  isClearable
                  className="w-full"
                  placeholder="اختر العملة"
                  onChange={(val) => field.onChange(val?.value ?? "")}
                  value={currencyOptions.find(
                    (opt) => opt.value === field.value
                  )}
                />
              )}
            />
          </div>
          {/* زر الإرسال */}
          <div className="flex justify-end">
            <Button className="px-6 py-2">إضافة</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
