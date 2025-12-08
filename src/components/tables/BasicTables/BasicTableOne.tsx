// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHeader,
//   TableRow,
// } from "../../ui/table";

// import Button from "../../ui/button/Button";
// import { Modal } from "../../ui/modal";
// import UpdateCategoryForm from "../../../POS/gropeCategry/Category/UpdateForm";
// import { useState } from "react";
// import { ICategoryGet, useDeleteCategoryMutation, useGetCategoriesQuery } from "../../../app/features/categories/catrgories";




// interface Itebos {
//   NameTebol: string;
//   Nots: string;
// }
// export default function BasicTableOne({
//   NameTebol,
//   Nots,
// }: Itebos) {
//   const { data, error, isLoading } = useGetCategoriesQuery();
//   const [isOpenUp, SetIsOpenUp] = useState(false);
//   const [tempCat, SetTempCat] = useState<ICategoryGet | undefined>();
//   const onCloseUp = () => {
//     SetIsOpenUp(false);
//   };

//   const onOpenUp = () => {
//     SetIsOpenUp(true);
//   };
//   const categories = data?.data ?? [];

//   const [deleteCategory] = useDeleteCategoryMutation();
 


//   if (isLoading) return <p>جاري تحميل البيانات...</p>;

//   if (error) return <p className="text-red-500">حدث خطأ أثناء جلب البيانات!</p>;
//   return (
//     <>
//       <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
//         <div className="max-w-full overflow-x-auto">
//           <Table>
//             {/* Table Header */}
//             <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
//               <TableRow>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   {NameTebol}
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   {Nots}
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   تعديل
//                 </TableCell>
//                 <TableCell
//                   isHeader
//                   className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
//                 >
//                   حذف
//                 </TableCell>
//               </TableRow>
//             </TableHeader>

//             {/* Table Body */}
//             <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
//             {categories.map((order: ICategoryGet) => (
//                 <TableRow key={order.id}>
//                   <TableCell className="px-5 py-4 sm:px-6 text-start">
//                     <div className="flex items-center gap-3">
//                       <div>
//                         <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
//                           {order.name}
//                         </span>
//                       </div>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     {order.notes}
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     <div className="flex -space-x-2">
//                       <Button
//                         className=""
//                         onClick={() => {
//                           onOpenUp();
//                           SetTempCat(order);
//                         }}
//                       >
//                         {" "}
//                         تعديل
//                       </Button>
//                     </div>
//                   </TableCell>
//                   <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
//                     <Button className="bg-red-500" onClick={() =>   deleteCategory(order?.id)}>
//                       {" "}
//                       حذف
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       </div>

//       <Modal
//         className="w-full  lg:w-4/12 xl:w-4/12  h-auto relative  rounded-3xl bg-white  dark:bg-gray-900"
//         isOpen={isOpenUp}
//         onClose={onCloseUp}
//       >
//         <h1 className="flex justify-center p-3  text-3xl">تعديل قسم</h1>
//         <UpdateCategoryForm tempCat={tempCat} />
//       </Modal>
//     </>
//   );
// }
