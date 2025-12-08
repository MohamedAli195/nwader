import React, { ChangeEvent } from 'react';
import Input from '../form/input/InputField';

interface SearchInputProps {
  search: string;
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void
  inputRef?: React.Ref<HTMLInputElement>;
}

const SearchInput = ({ search, handleSearch, inputRef }: SearchInputProps) => {
  return (
    <Input
      value={search}
      onChange={handleSearch}
      ref={inputRef}
      type="text"
      placeholder="Search or type command..."
className="
  h-11 
  w-full xl:w-[430px] 
  rounded-lg 
  border border-gray-200 dark:border-gray-800 
  bg-transparent dark:bg-white/[0.03] 
  py-2.5 pl-12 pr-14 
  text-sm text-gray-800 dark:text-white/90 
  placeholder:text-gray-400 dark:placeholder:text-white/30 
  shadow-theme-xs 
  focus:border-brand-300 focus:outline-none focus:ring-3 focus:ring-brand-500/10 
  dark:focus:border-brand-800
"
    />
  );
};

export default SearchInput;
