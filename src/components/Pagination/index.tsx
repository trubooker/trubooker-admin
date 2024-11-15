import React from "react";
import { ChevronRightIcon, ChevronLeftIcon } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="pagination flex items-center  justify-between gap-x-5 border-none">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        className="p-1 bg-white border border-gray-400 rounded cursor-pointer px-4"
        disabled={currentPage === 1}
      >
        {/* <ChevronLeftIcon className="w-6" /> */}
        Previous
      </button>
      <div>
        <span className="mx-4 bg-[--primary-orange] p-3 rounded-md text-white">
          {currentPage}{" "}
        </span>
        <span className="text-sec-1 text-sm lg:text-base mb-1">...</span>
        <span className="mx-4">{totalPages} </span>
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        className="p-1 bg-white border border-gray-400 rounded cursor-pointer px-4"
        disabled={currentPage === totalPages}
      >
        {/* <ChevronRightIcon className="w-6" /> */}
        Next
      </button>
    </div>
  );
};

export default Pagination;
