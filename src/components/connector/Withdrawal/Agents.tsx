"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/Pagination";
import { Tab } from "./Tab";

const Withdrawal = ({
  data: SingleAgentListData,
  loading,
  isFetching,
}: any) => {
  const [page, setPage] = useState(1);
  // const {
  //   isLoading: loading,
  //   data,
  //   isFetching,
  // } = useGetStudentReportQuery(page);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const userData: any = [];
  const users = userData;
  const totalPages = users?.data?.instructors?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          {isFetching || loading ? (
            <>
              <Table className="">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm">
                    <TableHead className="text-center font-bold w-1/3">
                      Amount
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Date
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
            <Tab
              data={SingleAgentListData}
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
  );
};

export default Withdrawal;
