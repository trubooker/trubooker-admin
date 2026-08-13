"use client";

import React, { useCallback, useEffect, useState } from "react";
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
import { AgentList } from "@/components/connector/agentList";
import { useGetAgentsQuery } from "@/redux/services/Slices/agentApiSlice";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaSort } from "react-icons/fa";

const Agent = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Step 1: status filter state. "all" means no filter sent to the API.
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // NOTE: status is now sent to the API so filtering works across ALL
  // records, not just the 10 currently loaded on this page. This assumes
  // the /v1/admin/agents endpoint accepts a `status` query param — confirm
  // with the backend and adjust the param name if it differs (e.g. filter[status]).
  const {
    isLoading: loading,
    data: userData,
    isFetching,
  } = useGetAgentsQuery({
    page,
    search: searchQuery,
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const AgentListData = userData?.result?.data;

  // Correct field for number of pages. `pageCount` is what the API returns
  // (previousPage is a boolean/pointer, not a total — that was the bug).
  const totalPages = userData?.result?.meta?.pageCount ?? 0;

  // Correct field for the total record count across all pages, for the badge.
  const totalRecords = userData?.result?.meta?.totalRecords ?? 0;

  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1);
    }, 300),
    []
  );

  const handleSearch = (query: string) => {
    debounceSearch(query);
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setPage(1); // reset to page 1 whenever the filter changes
  };

  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex gap-x-3 items-center ps-3 mb-5">
        <h2 className="text-2xl font-bold">Connectors</h2>
        <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
          {totalRecords}
        </div>
      </div>
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-5">
            <div className="flex flex-col lg:flex-row gap-x-3 lg:justify-between text-left lg:text-center lg:items-center">
              <Search
                placeholder={"Search..."}
                onSearch={handleSearch}
                classname="mb-5 max-w-[300px] "
              />
              <div className="mb-4">
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
                    <DropdownMenuItem onClick={() => handleStatusFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("pending")}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusFilter("deleted")}>
                      Deleted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {isFetching || loading ? (
              <Table>
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
                  {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                    <TableRow key={row}>
                      {[1, 2, 3, 4, 5].map((cell) => (
                        <TableCell key={cell}>
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
            ) : (
              <AgentList
                data={AgentListData}
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

export default Agent;