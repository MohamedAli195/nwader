import { useState } from "react";
import { User, Phone, Mail, School } from "lucide-react";
import { useGetStudentByQrQuery } from "../../../app/features/qrApi/qrApi";
import { useTranslation } from "react-i18next";

const StudentQrLookup = () => {
  const { t } = useTranslation();

  const [qrCode, setQrCode] = useState("");
  const [searchCode, setSearchCode] = useState("");

  const { data, isLoading, isError, refetch } = useGetStudentByQrQuery(
    searchCode,
    { skip: !searchCode }
  );

  const handleSearch = () => {
    if (!qrCode.trim()) return;
    setSearchCode(qrCode.trim());
    refetch();
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-purple-100 via-purple-50 to-purple-100 px-4 py-10 flex flex-col items-center">
      
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-6 text-center">
        {t("student_lookup")}
      </h1>

      {/* Search Box */}
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 border border-purple-100">
        <label className="block text-lg font-semibold text-gray-700 mb-2 text-center">
          {t("enter_qr")}
        </label>

        <input
          type="text"
          value={qrCode}
          onChange={(e) => setQrCode(e.target.value)}
          placeholder={t("example_qr")}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl text-lg focus:ring-2 focus:ring-purple-500 outline-none"
        />

        <button
          onClick={handleSearch}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl mt-4 transition text-lg"
        >
          {t("search")}
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <p className="mt-6 text-purple-700 text-xl font-semibold animate-pulse">
          {t("loading")}
        </p>
      )}

      {/* Error */}
      {isError && (
        <p className="mt-6 text-red-600 text-xl font-semibold">
          {t("error")}
        </p>
      )}

      {/* Result Card */}
      {data && (
        <div className="mt-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-purple-200 p-8 text-right">
          
          <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
            {t("student_data")}
          </h2>

          <div className="space-y-5">

            {/* Full Name */}
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-full">
                <User size={22} />
              </div>
              <p className="text-lg font-semibold">{data.data.full_name}</p>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-full">
                <Mail size={22} />
              </div>
              <p className="text-lg">{data.data.email}</p>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-full">
                <Phone size={22} />
              </div>
              <p className="text-lg">{data.data.phone}</p>
            </div>

            {/* Institution */}
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-700 p-3 rounded-full">
                <School size={22} />
              </div>
              <p className="text-lg">
                {data.data.institution?.name || t("not_specified")}
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StudentQrLookup;
