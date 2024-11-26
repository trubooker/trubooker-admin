"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useCallback, useEffect, useState } from "react";
import Search from "../../SearchBar";
import debounce from "lodash/debounce";
import { Skeleton } from "../../ui/skeleton";
import Pagination from "../../Pagination";
import { Roles_Table } from "./table";
import { SettingsRoleListData } from "@/constants";

const RolesTable = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  //   const {
  //     isLoading: loading,
  //     data: userData,
  //     isFetching,
  //   } = useGetPassengersQuery({ page, search: searchQuery });
  const userData: any = {};
  const isFetching: boolean = false;
  const loading: boolean = false;
  const totalPages = userData?.meta?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  const [filteredStudents, setFilteredStudents] =
    useState(SettingsRoleListData);

  useEffect(() => {
    if (SettingsRoleListData) {
      setFilteredStudents(SettingsRoleListData);
    }
  }, [SettingsRoleListData]);

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
                    {/* <TableHead className="text-left font-bold w-1/6">
                        Id
                      </TableHead> */}
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
            <Roles_Table
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
  );
};

export default RolesTable;
