import { NewspaperIcon, QrCodeIcon, SchoolIcon, UniversityIcon } from "lucide-react";
import { useGetAdminStatisticsQuery } from "../../app/features/dashboeardStatistics/dashStatistics";
import { BoxIconLine, GroupIcon } from "../../icons";

export default function EcommerceMetrics() {
  const { data: stats, isLoading } = useGetAdminStatisticsQuery();

  if (isLoading) return <p>Loading...</p>;

  const iconMap: Record<string, any> = {
    total_products: BoxIconLine,
    active_products: BoxIconLine,
    total_students: GroupIcon,
    active_students: GroupIcon,
    total_institutions: SchoolIcon,
    total_universities: UniversityIcon,
    total_schools: SchoolIcon,
    total_news: NewspaperIcon,
    total_qr_scans: QrCodeIcon,
  };

  const colorMap: Record<string, string> = {
    total_products: "bg-purple-100 text-purple-700",
    active_products: "bg-purple-200 text-purple-800",
    total_students: "bg-blue-100 text-blue-700",
    active_students: "bg-blue-200 text-blue-800",
    total_institutions: "bg-green-100 text-green-700",
    total_universities: "bg-green-200 text-green-800",
    total_schools: "bg-green-300 text-green-900",
    total_news: "bg-yellow-100 text-yellow-700",
    total_qr_scans: "bg-red-100 text-red-700",
  };

  const metrics = Object.entries(stats?.data || {});

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 md:gap-6">
      {metrics.map(([key, value]) => {
        const Icon = iconMap[key] || BoxIconLine;
        const colors = colorMap[key] || "bg-gray-100 text-gray-800";

        return (
          <div
            key={key}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 flex flex-col items-center text-center"
          >
            {/* أيقونة */}
            <div className={`flex items-center justify-center w-14 h-14 rounded-xl mb-3 ${colors}`}>
              <Icon className="size-6" />
            </div>

            {/* اسم الإحصائية */}
            <span className={`font-medium mb-2 ${colors.split(" ")[1]}`}>
              {key.replace(/_/g, " ").toUpperCase()}
            </span>

            {/* الرقم */}
            <h4 className={`font-bold text-2xl ${colors.split(" ")[1]}`}>
              {value}
            </h4>
          </div>
        );
      })}
    </div>
  );
}
