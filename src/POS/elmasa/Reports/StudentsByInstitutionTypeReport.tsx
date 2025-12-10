// src/components/reports/StudentsByInstitutionTypeReport.tsx


import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { StudentsByInstitutionType, useGetStudentsByInstitutionTypeQuery } from "../../../app/features/reports/reportsApi";

export default function StudentsByInstitutionTypeReport() {
  const { data, isLoading, isError } = useGetStudentsByInstitutionTypeQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load data.</p>;

  const studentsData: StudentsByInstitutionType[] = data?.data || [];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">Students by Institution Type</h2>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full text-left border border-gray-200 rounded-lg">
          <thead className="bg-purple-100">
            <tr>
              <th className="px-4 py-2 border-b">Institution Type</th>
              <th className="px-4 py-2 border-b">Student Count</th>
            </tr>
          </thead>
          <tbody>
            {studentsData.map((item, idx) => (
              <tr key={idx} className="even:bg-gray-50">
                <td className="px-4 py-2 border-b capitalize">{item.type}</td>
                <td className="px-4 py-2 border-b">{item.student_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={studentsData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" tick={{ fill: "#4B5563" }} />
          <YAxis tick={{ fill: "#4B5563" }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="student_count" fill="#7C3AED" name="Students" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
