import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import {
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "../../app/features/notifications/notifications";
import toast from "react-hot-toast";
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, refetch } = useGetNotificationsQuery(undefined, {
    pollingInterval: 5000, // جلب البيانات تلقائيًا كل 5 ثواني
  });
  const notifications = data?.data || [];
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [markAsRead] = useMarkAsReadMutation();

  // حساب عدد الإشعارات غير المقروءة مباشرة من البيانات
  const unreadCount = data?.data.filter((n) => !n.read_at).length || 0;
  const notifying = unreadCount > 0;

  // عرض التوست لكل إشعار جديد
  useEffect(() => {
    if (!data) return;
    data.data.forEach((n) => {
      if (!n.read_at) {
        toast(n.data.message, {
          id: n.id,
          style: {
            background: "#7C3AED", // اللون البنفسجي
            color: "#FFFFFF", // لون الخط أبيض
            padding: "10px 15px",
            borderRadius: "10px",
            fontWeight: "500",
          },
        }); // نستخدم id لتجنب تكرار التوست لنفس الإشعار
      }
    });
  }, [data]);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);
  };

  const handleItemClick = async (id: string) => {
    await markAsRead(id);
    refetch(); // تحديث القائمة بعد جعل الإشعار مقروء
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refetch();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full dropdown-toggle hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
        onClick={handleButtonClick}
      >
        {/* التنبيه */}
        {notifying && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-400 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}

        {/* أيقونة الجرس */}
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C9.23858 2 7 4.23858 7 7V11C7 12.6569 6.32843 14.1569 5.17157 15.1716L4 16.3431V17H20V16.3431L18.8284 15.1716C17.6716 14.1569 17 12.6569 17 11V7C17 4.23858 14.7614 2 12 2ZM12 22C13.1046 22 14 21.1046 14 20H10C10 21.1046 10.8954 22 12 22Z"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="absolute -right-[240px] mt-[17px] flex h-[480px] w-[320px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg sm:w-[361px] lg:right-0"
      >
        {/* Header مع زر Mark all as read */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
          <h5 className="text-lg font-semibold text-gray-800">Notification</h5>

          <div className="flex items-center gap-3">
            {notifications.length > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
        </div>

        <ul className="flex flex-col h-auto overflow-y-auto custom-scrollbar">
          {data?.data.map((n) => (
            <li key={n.id}>
              <DropdownItem
                onItemClick={() => handleItemClick(n.id)}
                className={`flex gap-3 items-center rounded-lg border-b border-gray-100 p-3 hover:bg-gray-100 ${
                  !n.read_at ? "bg-orange-50" : "bg-white"
                }`}
                to={n.data.action_url || "/"}
              >
                {!n.read_at && (
                  <span className="inline-block h-2 w-2 rounded-full bg-orange-400"></span>
                )}
                <span className="flex-1 text-gray-700">{n.data.message}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(n.created_at).toLocaleTimeString()}
                </span>
              </DropdownItem>
            </li>
          ))}
        </ul>

        <Link
          to="/notifications"
          className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          View All Notifications
        </Link>
      </Dropdown>
    </div>
  );
}
