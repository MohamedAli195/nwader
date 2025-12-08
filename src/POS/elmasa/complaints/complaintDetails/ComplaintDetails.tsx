import { useParams } from "react-router";
import { useGetComplaintQuery } from "../../../../app/features/complaints/complaintsSlice";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

const ComplaintDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetComplaintQuery(id);

  if (isLoading) return <div className="p-6">جارٍ التحميل...</div>;
  if (isError)
    return <div className="p-6 text-red-500">حدث خطأ أثناء تحميل البيانات</div>;

  if (!data) return null;

  const complaint = data?.data;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* العنوان + الحالة */}
      <div className="bg-white shadow rounded-lg p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          {complaint.subject}
        </h1>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
            statusColors[complaint.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {complaint.status === "pending"
            ? "قيد الانتظار"
            : complaint.status === "in_progress"
            ? "قيد المعالجة"
            : complaint.status === "resolved"
            ? "تم الحل"
            : complaint.status === "closed"
            ? "مغلقة"
            : complaint.status}
        </span>
      </div>

      {/* بيانات الطالب */}
      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-semibold text-purple-700 border-b pb-2">
          بيانات الطالب
        </h2>
        <p>
          <span className="font-medium text-gray-700">الاسم: </span>
          {complaint.submitted_by_student?.name}
        </p>
        <p>
          <span className="font-medium text-gray-700">الهاتف: </span>
          {complaint.submitted_by_student?.phone}
        </p>
        <p>
          <span className="font-medium text-gray-700">تاريخ الإرسال: </span>
          {complaint.submitted_at}
        </p>
      </div>

      {/* بيانات المعلم */}
      {complaint.complaint_about_teacher && (
        <div className="bg-white shadow rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-semibold text-purple-700 border-b pb-2">
            بيانات المعلم
          </h2>
          <p>
            <span className="font-medium text-gray-700">الاسم: </span>
            {complaint.complaint_about_teacher?.name}
          </p>
          <p>
            <span className="font-medium text-gray-700">الهاتف: </span>
            {complaint.complaint_about_teacher?.phone}
          </p>
          {complaint.complaint_about_teacher?.image_url && (
            <div className="mt-2">
              <img
                src={complaint.complaint_about_teacher.image_url}
                alt="صورة المعلم"
                className="w-24 h-24 rounded-lg border object-cover"
              />
            </div>
          )}
        </div>
      )}

      {/* محتوى الشكوى */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-semibold text-purple-700 border-b pb-2">
          محتوى الشكوى
        </h2>
        <p className="text-gray-700 leading-relaxed">{complaint.message}</p>
      </div>

      {/* الردود */}
      {complaint.responses && complaint.responses.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold text-purple-700 border-b pb-2">
            الردود
          </h2>
          <ul className="divide-y">
            {complaint.responses.map((res) => (
              <li key={res.id} className="py-3">
                <p className="text-gray-800">{res.message}</p>
                <p className="text-sm text-gray-500 mt-1">
                  بتاريخ: {res.responded_at}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
