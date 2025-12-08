import { FC } from "react";

interface FileInputProps {
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileInput: FC<FileInputProps> = ({ className, onChange }) => {
  return (
    <input
      type="file"
className={`
  h-11 
  w-full 
  overflow-hidden 
  rounded-lg 
  border border-gray-300 dark:border-gray-700 
  bg-transparent dark:bg-gray-900 
  text-sm text-gray-500 dark:text-gray-400
  placeholder:text-gray-400 dark:placeholder:text-gray-400 
  shadow-theme-xs 
  transition-colors 
  focus:outline-none focus:border-ring-brand-300 
  file:mr-5 
  file:cursor-pointer 
  file:rounded-l-lg 
  file:border-0 file:border-r file:border-solid 
  file:border-gray-200 dark:file:border-gray-800 
  file:bg-gray-50 dark:file:bg-white/[0.03] 
  hover:file:bg-gray-100 
  file:py-3 file:pl-3.5 file:pr-3 
  file:text-sm file:text-gray-700 dark:file:text-gray-400 
  focus:file:ring-brand-300 
  ${className}
`}
      onChange={onChange}
    />
  );
};

export default FileInput;
