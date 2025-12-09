"use client";
import React, { useState, useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { Input } from "./ui/input";

interface Props<T> {
  classname?: string;
  placeholder: string;
  // data: T[];
  onSearch: (query: string) => void;
  // filterKey: string[];
  // emptyListState: React.ReactNode;
  defaultValue?: string; // Add this
}

const Search: React.FC<Props<any>> = ({
  placeholder,
  classname,
  onSearch,
  // data,
  // filterKey,
  // emptyListState,
  defaultValue = "", // Add this with default value
}) => {
  const [query, setQuery] = useState(defaultValue); // Initialize with defaultValue

  // Update query when defaultValue changes (when coming back from another page)
  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

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