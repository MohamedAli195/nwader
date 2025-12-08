import { useParams } from "react-router";
import { useGetInquirieQuery } from "../../../../app/features/inquiries/inquiriesSlice";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border border-yellow-300",
  in_progress: "bg-blue-100 text-blue-700 border border-blue-300",
  resolved: "bg-green-100 text-green-700 border border-green-300",
  closed: "bg-gray-100 text-gray-700 border border-gray-300",
};
type Response = {
  id: number;
  message: string;
  responded_at: string;
};
const InquiriesDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetInquirieQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="text-lg text-gray-600">جارٍ التحميل...</span>
      </div>
    );

  if (isError)
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        حدث خطأ أثناء تحميل البيانات
      </div>
    );

  if (!data) return null;

  const inquirie = data?.data;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      {/* العنوان + الحالة */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">{inquirie.subject}</h1>
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium shadow-sm ${
            statusColors[inquirie.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {inquirie.status}
        </span>
      </div>

      {/* بيانات الطالب */}
      <div className="bg-white shadow-md rounded-xl p-6 space-y-2 border">
        <h2 className="text-lg font-semibold text-purple-700 mb-3">
          بيانات الطالب
        </h2>
        <p className="text-gray-700">
          <span className="font-medium">الاسم: </span>
          {inquirie.author?.name}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">النوع: </span>
          {inquirie.author?.type}
        </p>
        <p className="text-gray-700">
          <span className="font-medium">تاريخ الإرسال: </span>
          {inquirie.submitted_at}
        </p>
      </div>

      {/* نص الاستفسار */}
      <div className="bg-white shadow-md rounded-xl p-6 border">
        <h2 className="text-lg font-semibold text-purple-700 mb-3">
          محتوى الاستفسار
        </h2>
        <p className="text-gray-700 leading-relaxed">{inquirie.message}</p>
      </div>

      {/* الردود */}
      {inquirie.responses && inquirie.responses.length > 0 && (
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-lg font-semibold text-purple-700 mb-4">الردود</h2>
          <ul className="space-y-4">
            {inquirie.responses.map((res: Response) => (
              <li
                key={res.id}
                className="border rounded-lg p-4 bg-gray-50 shadow-sm"
              >
                <p className="text-gray-800 mb-2">{res.message}</p>
                <p className="text-sm text-gray-500">
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

export default InquiriesDetails;
