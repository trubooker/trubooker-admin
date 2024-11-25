"use client";

import React, { FC, useCallback, useEffect, useState } from "react";
// import { SinglePassengerLisstData } from "@/constants";
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
import { PassengerTable } from "./PassengerTable";

export interface SinglePassengerListDataProps {
  data: [
    {
      amount: string | null;
      arrival_date: string | null;
      arrival_location: string | null;
      departure_date: string | null;
      departure_location: string | null;
      departure_time: string | null;
      status: "completed" | "active" | "upcoming" | "cancelled";
      id: string | null;
    }
  ];
}
const PassengerTripTable: FC<SinglePassengerListDataProps> = ({
  data: SinglePassengerListData,
}) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  // const {
  //   isLoading: loading,
  //   data,
  //   isFetching,
  // } = useGetStudentReportQuery({ page, search: searchQuery });
  const loading: boolean = false;
  const isFetching: boolean = false;
  const userData: any = [];
  const users = userData;
  const totalPages = users?.data?.instructors?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  const [filteredStudents, setFilteredStudents] = useState(
    SinglePassengerListData
  );

  useEffect(() => {
    if (SinglePassengerListData) {
      setFilteredStudents(SinglePassengerListData);
    }
  }, [SinglePassengerListData]);

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
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-5">
            <div className="py-4">
              <h2 className="text-base font-bold">Trip history</h2>
            </div>
            {isFetching || loading ? (
              <>
                <Table className="">
                  <TableHeader>
                    <TableRow className="text-xs lg:text-sm">
                      <TableHead className="text-left font-bold w-1/6">
                        Trip Id
                      </TableHead>
                      <TableHead className="font-bold w-1/6">
                        Departure
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Destination
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Date
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Status
                      </TableHead>
                      <TableHead className="font-bold w-1/6 text-center">
                        Amount paid
                      </TableHead>
                      <TableHead className="text-center font-bold w-1/6">
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
              <PassengerTable
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

export default PassengerTripTable;
