import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";

import { RootState } from "../app/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  const language = useSelector((state: RootState) => state.language.language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.dir = language === "ar" ? "rtl" : "ltr";
    console.log("render", language);
  }, [language]);

  const getMarginClass = () => {
    if (isMobileOpen) return language === "ar" ? "mr-0" : "ml-0";
    if (isExpanded || isHovered)
      return language === "ar" ? "lg:mr-[290px]" : "lg:ml-[290px]";
    return language === "ar" ? "lg:mr-[90px]" : "lg:ml-[90px]";
  };

  return (
    <div
      dir={language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen xl:flex"
    >
      <div>
        <AppSidebar />
        <Backdrop />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${getMarginClass()}`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-[--breakpoint-2xl] md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
