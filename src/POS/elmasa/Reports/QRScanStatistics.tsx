// src/components/reports/QRScanStatistics.tsx

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useGetQRScanStatisticsQuery } from "../../../app/features/reports/reportsApi";

export default function QRScanStatistics() {
  const { data, isLoading, error } = useGetQRScanStatisticsQuery();

  if (isLoading) return <p>Loading QR Scan Statistics...</p>;
  if (error) return <p>Error loading data</p>;

  const stats = data?.data;

  return (
    <div className="space-y-8">
      {/* الملخص */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-gray-500 dark:text-gray-300">Total Scans</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.total_scans}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-gray-500 dark:text-gray-300">Total Students Scanned</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.top_scanned_students.length}</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow">
          <p className="text-gray-500 dark:text-gray-300">Devices Used</p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{stats?.scans_by_device.length}</h2>
        </div>
      </div>

      {/* جدول الطلاب الأكثر مسحًا */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2">Student Name</th>
              <th className="px-4 py-2">QR Code</th>
              <th className="px-4 py-2">Scan Count</th>
            </tr>
          </thead>
          <tbody>
            {stats?.top_scanned_students.map((student) => (
              <tr key={student.student_id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{student.student_name}</td>
                <td className="px-4 py-2">{student.qr_code}</td>
                <td className="px-4 py-2">{student.scan_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* الرسم البياني لعدد المسحات حسب التاريخ */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Scans by Date
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats?.scans_by_date || []}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="scan_count" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
