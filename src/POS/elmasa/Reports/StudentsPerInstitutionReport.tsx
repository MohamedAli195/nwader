

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetStudentsPerInstitutionQuery } from "../../../app/features/reports/reportsApi";

export default function StudentsPerInstitutionReport() {
  const { data, isLoading, isError } = useGetStudentsPerInstitutionQuery();

  if (isLoading) return <p className="text-center py-10">Loading...</p>;
  if (isError) return <p className="text-center py-10">Error loading data</p>;

  const tableData = data?.data || [];
  const summary = data?.summary;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* ملخص إجمالي الطلاب والمؤسسات */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="bg-purple-100 rounded-xl p-4 text-center">
          <p className="text-gray-700 font-medium">Total Institutions</p>
          <h3 className="text-2xl font-bold">{summary?.total_institutions}</h3>
        </div>
        <div className="bg-green-100 rounded-xl p-4 text-center">
          <p className="text-gray-700 font-medium">Total Students</p>
          <h3 className="text-2xl font-bold">{summary?.total_students}</h3>
        </div>
      </div>

      {/* جدول البيانات */}
      <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Institution Name</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Student Count</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((inst) => (
              <tr key={inst.institution_id || inst.institution_name}>
                <td className="px-4 py-2 border">{inst.institution_name}</td>
                <td className="px-4 py-2 border capitalize">{inst.institution_type}</td>
                <td className="px-4 py-2 border font-bold">{inst.student_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* الرسم البياني */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-bold mb-4">Students per Institution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tableData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="institution_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="student_count" fill="#7c3aed" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
