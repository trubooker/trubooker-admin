"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Search from "@/components/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash/debounce";
import Pagination from "@/components/Pagination";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DriverList } from "@/components/Driver/DriverList";
import { useGetDriversQuery } from "@/redux/services/Slices/driverApiSlice";
import { Button } from "@/components/ui/button";
import { FaSort } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Drivers = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get parameters from URL or use defaults
  const urlPage = searchParams.get('page');
  const urlSearch = searchParams.get('search') || "";
  const urlPerPage = searchParams.get('per_page');
  
  const [page, setPage] = useState(urlPage ? parseInt(urlPage) : 1);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [perPage, setPerPage] = useState(urlPerPage ? parseInt(urlPerPage) : 10);
  
  const {
    isLoading: loading,
    data: userData,
    isFetching,
  } = useGetDriversQuery({ page, search: searchQuery, per_page: perPage });
  
  console.log("Driver", userData);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const DriverListData = userData?.data;
  const totalPages = userData?.meta?.last_page;
  
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
      // Update URL with new page
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', pageNumber.toString());
      if (searchQuery) {
        params.set('search', searchQuery);
      }
      if (perPage !== 10) {
        params.set('per_page', perPage.toString());
      }
      router.push(`/drivers?${params.toString()}`, { scroll: false });
    }
  };
  
  // Handle per page change
  const handlePerPageChange = (newPerPage: string) => {
    const perPageValue = parseInt(newPerPage);
    setPerPage(perPageValue);
    setPage(1); // Reset to first page when changing per_page
    
    // Update URL with new per_page
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');
    params.set('per_page', perPageValue.toString());
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    router.push(`/drivers?${params.toString()}`, { scroll: false });
  };
  
  const [filteredStudents, setFilteredStudents] = useState(DriverListData);

  useEffect(() => {
    if (DriverListData) {
      setFilteredStudents(DriverListData);
    }
  }, [DriverListData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
      // Update URL with search and reset to page 1
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', '1');
      if (query) {
        params.set('search', query);
      } else {
        params.delete('search');
      }
      if (perPage !== 10) {
        params.set('per_page', perPage.toString());
      }
      router.push(`/drivers?${params.toString()}`, { scroll: false });
    }, 300),
    [router, searchParams, perPage]
  );

  const handleSearch = (query: string) => {
    debounceSearch(query);
  };

  // Step 2: Filter data based on the selected status filter
  const statusFilteredData =
    statusFilter === "all"
      ? filteredStudents
      : filteredStudents?.filter(
          (driver: any) => driver.status === statusFilter
        );

  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex gap-x-3 items-center ps-3 mb-5">
        <h2 className="text-2xl font-bold">Drivers</h2>
        <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
          {userData?.meta?.total || 0}
        </div>
      </div>
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-5">
            <div className="flex flex-col lg:flex-row gap-x-3 lg:justify-between text-left lg:text-center lg:items-center">
              <Search
                placeholder={"Search..."}
                onSearch={handleSearch}
                defaultValue={urlSearch}
                classname="mb-5 max-w-[300px] "
              />
              <div className="flex items-center gap-3 mb-4">
                <div>
                  <Select
                    value={perPage.toString()}
                    onValueChange={handlePerPageChange}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="30">30 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">
                        {statusFilter === "all" ? (
                          <div className="flex gap-x-2 items-center">
                            Sort by status <FaSort />
                          </div>
                        ) : (
                          <div className="flex items-center gap-x-2">
                            Sort by status :{" "}
                            <span className="capitalize">{statusFilter}</span>
                          </div>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px]">
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                        All
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                        Active
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("inactive")}
                      >
                        Inactive
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("deleted")}
                      >
                        Deleted
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
            {isFetching || loading ? (
              <>
                <Table className="">
                  <TableHeader>
                    <TableRow className="text-xs lg:text-sm">
                      <TableHead className="font-bold w-1/6">Name</TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Email
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Phone Number
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-bold w-1/6">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <TableCell key={i}>
                            <div>
                              <div className="w-full rounded-md">
                                <div>
                                  <Skeleton className="h-4 w-1/7 bg-gray-400" />
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <DriverList
                data={statusFilteredData}
                isFetching={isFetching}
                loading={loading}
              />
            )}
            {totalPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;