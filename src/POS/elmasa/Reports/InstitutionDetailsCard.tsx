

import { Loader2 } from "lucide-react";
import { useGetInstitutionDetailsQuery } from "../../../app/features/reports/reportsApi";
import { useState } from "react";
import Badge from "../../../components/ui/badge/Badge";
import { useGetInstitutionsQuery } from "../../../app/features/institution/institutionApi";


export default function InstitutionDetailsCard() {
 
  const { data:Institut, isLoading:isLoadingInstitutions } = useGetInstitutionsQuery(1);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<number | null>(null);

  // جلب بيانات المؤسسة المحددة
  const { data, isLoading, isError } = useGetInstitutionDetailsQuery(selectedInstitutionId || 0, {
    skip: selectedInstitutionId === null, // عدم الجلب قبل اختيار مؤسسة
  });

  // معالجة تحميل قائمة المؤسسات
  if (isLoadingInstitutions) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Select لاختيار المؤسسة */}
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">اختر المؤسسة:</label>
        <select
          className="w-full md:w-1/2 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          value={selectedInstitutionId || ""}
          onChange={(e) => setSelectedInstitutionId(Number(e.target.value))}
        >
          <option value="">-- اختر مؤسسة --</option>
          {Institut?.data.map((inst) => (
            <option key={inst.id || "na"} value={inst.id || 0}>
              {inst.name} ({inst.type})
            </option>
          ))}
        </select>
      </div>

      {/* عرض بيانات المؤسسة المحددة */}
      {selectedInstitutionId && (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="animate-spin w-8 h-8 text-purple-600" />
            </div>
          ) : isError || !data ? (
            <div className="text-red-500 font-semibold text-center py-10">
              حدث خطأ أثناء جلب بيانات المؤسسة.
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-2xl p-6 space-y-6">
              {/* اسم المؤسسة ونوعها */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {data.data.institution.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {data.data.institution.type}
                  </p>
                </div>
                <Badge color="primary">{data.data.institution.type}</Badge>
              </div>

              {/* إحصائيات الطلاب */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">الطلاب الكلي</p>
                  <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
                    {data.data.statistics.total_students}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">الطلاب النشطين</p>
                  <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
                    {data.data.statistics.active_students}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">الطلاب غير النشطين</p>
                  <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
                    {data.data.statistics.inactive_students}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    تم التسجيل خلال 30 يوم
                  </p>
                  <p className="mt-2 text-xl font-bold text-gray-800 dark:text-white">
                    {data.data.statistics.students_registered_last_30_days}
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
