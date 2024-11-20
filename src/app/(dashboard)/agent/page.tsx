"use client";

import React, { useCallback, useEffect, useState } from "react";
// import QuickActions from "@/components/(admin)/quick-action";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Search from "@/components/SearchBar";
import { AgentListData } from "@/constants";
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
import { AgentList } from "@/components/agent/agentList";

const Agent = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const {
  //   isLoading: loading,
  //   data,
  //   isFetching,
  // } = useGetStudentReportQuery({ page, search: searchQuery });
  const loading: boolean = false;
  const isFetching: boolean = false;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userData: any = [];
  const users = userData;
  const totalPages = users?.data?.instructors?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  const [filteredStudents, setFilteredStudents] = useState(AgentListData);

  useEffect(() => {
    if (AgentListData) {
      setFilteredStudents(AgentListData);
    }
  }, [users]);

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
  return (
    <div className="flex flex-col h-fit w-full">
      {/* <div className="py-4">
      </div> */}
      <div className="flex gap-x-3 items-center ps-3 mb-5">
        <h2 className="text-2xl font-bold">Agents</h2>
        <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
          {AgentListData.length}
        </div>
      </div>
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-5">
            <Search
              placeholder={"Search..."}
              onSearch={handleSearch}
              classname="mb-5 max-w-[300px] lg:w-[400px] lg:max-w-[1000px]"
            />
            {isFetching || loading ? (
              <>
                <Table className="">
                  <TableHeader>
                    <TableRow className="text-xs lg:text-sm">
                      <TableHead className="text-left font-bold w-1/6">
                        Id
                      </TableHead>
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
                        {[1, 2, 3, 4, 5, 6].map((i) => (
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
              <AgentList
                data={filteredStudents}
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
