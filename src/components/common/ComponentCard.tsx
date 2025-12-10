import Button from "../ui/button/Button";
import { useTranslation } from "react-i18next";

interface ComponentCardProps {
  onOpen?: () => void;
  title: string;
  children: React.ReactNode;
  className?: string; // Additional custom classes for styling
  desc?: string; // Description text
  isAdd?: boolean;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  onOpen,
  title,
  children,
  className = "",
  isAdd = true,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ${className}`}>
      {/* Card Header */}
      <div className="px-6 py-5 flex justify-between items-center">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {isAdd && (
          <Button onClick={onOpen} className="bg-green-600 font-bold">
            {t("Add") || "اضافة"}
          </Button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  );
};

export default ComponentCard;
