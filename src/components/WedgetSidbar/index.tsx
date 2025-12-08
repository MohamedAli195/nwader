import React from "react";

const SidebarWidget: React.FC = () => {
  return (
    <div className="mt-auto mb-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 text-center shadow-inner">
      <p className="text-sm text-gray-700 dark:text-gray-300">مرحبًا بك 👋</p>
      <p className="text-xs text-gray-400">نظام الإدارة التعليمية</p>
    </div>
  );
};

export default SidebarWidget;
