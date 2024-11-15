"use client";

import React, { useCallback, useEffect, useState } from "react";
// import QuickActions from "@/components/(admin)/quick-action";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Search from "@/components/SearchBar";
// import { StudentList } from "@/components/(admin)/studentList";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CountUp from "react-countup";
import { Skeleton } from "@/components/ui/skeleton";
import debounce from "lodash/debounce";
import Pagination from "@/components/Pagination";
import { StudentList } from "@/components/studentList";

const Passengers = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const {
  //   isLoading: loading,
  //   data,
  //   isFetching,
  // } = useGetStudentReportQuery({ page, search: searchQuery });
  const data: any = [];
  const isFetching = false;
  const loading = false;
  const users = data?.data?.students;
  const studentMetrics = data?.data;
  console.log(data);

  const totalPages = users?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  const [filteredStudents, setFilteredStudents] = useState(users?.data);

  useEffect(() => {
    if (users?.data) {
      setFilteredStudents(users?.data);
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
    <div className="flex flex-col h-fit w-full relative">
      <div className="py-4">
        <h2 className="text-2xl font-bold">Passengers</h2>
      </div>
      <div className="flex flex-col xl:flex-row w-full gap-4">
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
                      <TableHead className="text-left font-bold w-1/7">
                        Name
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Email
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Country
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Courses Enrolled
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Last Login
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-bold w-1/7">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
              <ScrollArea>
                <StudentList
                  data={filteredStudents}
                  isFetching={isFetching}
                  loading={loading}
                />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
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

export default Passengers;
