import React from "react";
import { useSearchParams, useRouter } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
        Next
      </button>
    </div>
  );
};

export default Pagination;