import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import {

  ChevronDownIcon,
  UserCircleIcon,
  HorizontaLDots,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "../components/WedgetSidbar";
import { ChartArea, ChartBar, ChartBarStacked, GalleryHorizontalEnd, IndentDecrease, Newspaper, University, UserCheck, UserSearchIcon } from "lucide-react";



type NavItem = {
  name: string;
  icon?: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { t, i18n } = useTranslation();
const isRTL = i18n.language === "ar";
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const mainItems: NavItem[] = [

    { name: t("Student inquiry"), path: "/StudentQrLookup", icon: <UserSearchIcon /> },
    { name: t("Students"), path: "/academic-students", icon: <UserCircleIcon /> },
    { name: t("roles"), path: "/roles", icon: <UserCheck /> },

    { name: t("Products"), path: "/products", icon: <GalleryHorizontalEnd /> },
    { name: t("institutions"), path: "/institution", icon: <University /> },
    { name: t("News"), path: "/news", icon: <Newspaper /> },
    { name: t("Numberofstudents"), path: "/StudentsPerInstitutionReport", icon: <ChartArea /> },
    { name: t("Numberoftype"), path: "/StudentsByInstitutionTypeReport", icon: <ChartBar /> },
    { name: t("QRScanDetails"), path: "/QRScanStatistics", icon: <ChartBarStacked /> },
    { name: t("aboutuniversitiesandschools"), path: "/InstitutionDetailsCard", icon: <IndentDecrease /> },
    // { name: t("الشكاوى"), path: "/complaints", icon: <PlugInIcon /> },
    // { name: t("الاستفسارات"), path: "/inquiries", icon: <PlugInIcon /> },

  ];

  const othersItems: NavItem[] = [
    // {
    //   icon: <UserCircleIcon />,
    //   name: t("الملف الشخصي"),
    //   path: "/profile",
    // },
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  console.log(subMenuHeight)
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? mainItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });
    if (!submenuMatched) setOpenSubmenu(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prev) => {
      if (prev && prev.type === menuType && prev.index === index) return null;
      return { type: menuType, index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              {nav.icon && (
                <span className="menu-item-icon-size">{nav.icon}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                {nav.icon && (
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
  <aside
  className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 
    bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 
    h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
    ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    ${isRTL ? "right-0 left-auto" : "left-0 right-auto"}
  `}
  onMouseEnter={() => !isExpanded && setIsHovered(true)}
  onMouseLeave={() => setIsHovered(false)}
>

      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/admin/images/logo.jpg"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/admin/images/logo.jpg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <img
              src="/admin/images/logo.jpg"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  ""
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(mainItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>

        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
