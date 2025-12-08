import { Dispatch, SetStateAction, useEffect } from "react";
import { FaAnglesRight, FaAnglesLeft } from "react-icons/fa6";
import { RootState } from "../../../app/store";
import { useSelector } from "react-redux";

interface IProps {
  page: number;
  SetPage: Dispatch<SetStateAction<number>>;
  total: number;
}
const Paginator = ({ page, SetPage, total }: IProps) => {
  const language = useSelector((state: RootState) => state.language.language);
  const perPage = 10;
  const totalPages = Math.ceil(total / perPage);
  const paginationWindow = 5; // عدد الصفحات الظاهرة

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    console.log("render", language);
  }, [language]);

  const handleNextPage = () => {
    if (page < totalPages) {
      SetPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      SetPage((prev) => prev - 1);
    }
  };

  const isArabic = language === "ar";
  const isEn = language === "en";
  const prevIcon = isArabic ? <FaAnglesRight /> : <FaAnglesLeft />;
  const nextIcon = isEn ? <FaAnglesRight /> : <FaAnglesLeft />;

  const generatePageNumbers = () => {
    const pages = [];

    let start = Math.max(1, page - Math.floor(paginationWindow / 2));
    let end = start + paginationWindow - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - paginationWindow + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="paginator my-6 flex justify-center items-center gap-2 flex-wrap">
      <button
        className="but_Primry px-3 py-1"
        onClick={handlePrevPage}
        disabled={page === 1}
        aria-label="Previous Page"
      >
        {prevIcon}
      </button>

      {generatePageNumbers().map((pg) => (
        <button
          key={pg}
          className={`px-3 py-1 rounded ${
            pg === page
              ? "bg-blue-600 text-white font-bold"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          onClick={() => SetPage(pg)}
        >
          {pg}
        </button>
      ))}

      <button
        className="but_Primry px-3 py-1"
        onClick={handleNextPage}
        disabled={page === totalPages}
        aria-label="Next Page"
      >
        {nextIcon}
      </button>
    </div>
  );
};

export default Paginator;
