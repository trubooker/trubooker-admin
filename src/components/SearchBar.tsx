"use client";
import React, { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Input } from "./ui/input";

interface Props<T> {
  classname?: string;
  placeholder: string;
  // data: T[];
  onSearch: (query: string) => void;
  // filterKey: string[];
  // emptyListState: React.ReactNode;
}

const Search: React.FC<Props<any>> = ({
  placeholder,
  classname,
  onSearch,
  // data,
  // filterKey,
  // emptyListState,
}) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`${classname} relative flex flex-1 flex-shrink-0`}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <Input
        type="text"
        value={query}
        className="block w-full rounded-full py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500 bg-[#F0F0F0]"
        placeholder={placeholder}
        onChange={handleSearch}
      />
      <HiMagnifyingGlass className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
    </div>
  );
};
export default Search;
