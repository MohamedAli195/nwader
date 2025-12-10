import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import ChartTab from "../common/ChartTab";
import { useGetStudentsPerInstitutionQuery } from "../../app/features/reports/reportsApi";
import { t } from "i18next";

export default function StudentsPerInstitutionChart() {
  const { data, isLoading, isError } = useGetStudentsPerInstitutionQuery();

  // 🟦 Loading
  if (isLoading)
    return (
      <div className="p-5 text-center text-gray-600 font-semibold">
        Loading chart...
      </div>
    );

  // 🔴 Error
  if (isError)
    return (
      <div className="p-5 text-center text-red-600 font-semibold">
        Failed to load chart data.
      </div>
    );

  // 🟩 Extract Data
  const categories = data?.data?.map((item) => item.institution_name) || [];
  const counts = data?.data?.map((item) => item.student_count) || [];

  // 🟪 No Data
  if (categories.length === 0)
    return (
      <div className="p-5 text-center text-gray-600 font-semibold">
        No data available.
      </div>
    );

  // ---- Chart Options ----
  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 4,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    dataLabels: { enabled: false },
    xaxis: {
      type: "category",
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
      },
    },
  };

  // ---- Chart Series ----
  const series = [
    {
      name: "Students",
      data: counts,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          {t("Numberofstudents")}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
           {t("Number of registered students per institution")}
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
}
