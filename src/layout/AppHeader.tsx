import { useEffect, useRef } from "react";
// import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

import { setLanguage } from "../app/features/languageSlice";
import { AppDispatch, RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const AppHeader: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { i18n } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);

  // ضبط الاتجاه
  const setDirection = (lang: string) => {
    const direction = lang === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("dir", direction);
    localStorage.setItem("language", lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setDirection(savedLanguage);
      dispatch(setLanguage(savedLanguage));
      i18n.changeLanguage(savedLanguage);
    } else {
      setDirection("en");
      dispatch(setLanguage("en"));
      i18n.changeLanguage("en");
    }
  }, [dispatch, i18n]);

  useEffect(() => {
    setDirection(language);
  }, [language]);

  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const lang = event.target.value;
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  // const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 flex w-full border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex w-full items-center justify-between px-3 py-3 lg:px-6 lg:py-4">
        {/* يسار الشاشة الكبيرة: الهامبورجر + اللغة */}
        <div className="flex items-center gap-3">
          {/* زر الهامبورجر */}
          <button
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 dark:border-gray-800 dark:text-gray-400 lg:h-11 lg:w-11"
          >
            {isMobileOpen ? (
              // أيقونة إغلاق
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.22 7.28a.75.75 0 011.06 0L12 11.94l4.72-4.72a.75.75 0 111.06 1.06L13.06 13l4.72 4.72a.75.75 0 11-1.06 1.06L12 14.06l-4.72 4.72a.75.75 0 11-1.06-1.06L10.94 13 6.22 8.28a.75.75 0 010-1.06z"
                  fill="currentColor"
                />
              </svg>
            ) : (
              // أيقونة همبورجر
              <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
                <path
                  d="M2 2h16M2 8h16M2 14h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>

          {/* اختيار اللغة */}
          <select
            value={language}
            onChange={changeLanguage}
            className="rounded-md border border-gray-300 px-2 py-1 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="en">EN</option>
            <option value="ar">AR</option>
          </select>
        </div>

        {/* يمين الشاشة الكبيرة: الأدوات */}
        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
