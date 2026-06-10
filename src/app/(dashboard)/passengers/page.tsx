"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
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
import { PassengerList } from "@/components/Passenger/passengerList";
import { useGetPassengersQuery } from "@/redux/services/Slices/passenger.ApiSlice";
import { FaSort } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Passenger } from "@/types";

const Passengers = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    isLoading: loading,
    data: userData,
    isFetching,
  } = useGetPassengersQuery({ page, search: searchQuery });

  const PassengerListData = userData?.result?.data;
  const meta = userData?.result?.meta;
const totalPages = meta ? Math.ceil(meta.count / meta.limit) : 1;
  //const totalPages = userData?.result?.meta?.last_page;
  
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  
  const [filteredStudents, setFilteredStudents] = useState(PassengerListData);

  useEffect(() => {
    if (PassengerListData) {
      setFilteredStudents(PassengerListData);
    }
  }, [PassengerListData]);

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

  const [statusFilter, setStatusFilter] = useState<string>("all");

  const statusFilteredData =
    statusFilter === "all"
      ? filteredStudents
      : filteredStudents?.filter(
          (passenger: any) => passenger.user.status === statusFilter
        );

  // Helper to count verified users
const verifiedCount = {
  emailVerified:
    filteredStudents?.filter((p: Passenger) => p.user.isEmailVerified).length || 0,
  phoneVerified:
    filteredStudents?.filter((p: Passenger) => p.user.isPhoneVerified).length || 0,
};


  return (
    <div className="flex flex-col h-fit w-full">
      <div className="flex gap-x-3 items-center ps-3 mb-5">
        <h2 className="text-2xl font-bold">Passengers</h2>
        <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
          {PassengerListData?.length}
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm text-gray-500">Total Passengers</h3>
          <p className="text-2xl font-bold">{PassengerListData?.length || 0}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm text-gray-500">Email Verified</h3>
          <p className="text-2xl font-bold text-green-600">{verifiedCount.emailVerified}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-sm text-gray-500">Phone Verified</h3>
          <p className="text-2xl font-bold text-blue-600">{verifiedCount.phoneVerified}</p>
        </div>
      </div>
      
      <div className="flex flex-col xl:flex-row w-full">
        <div className="w-full">
          <div className="bg-white rounded-lg w-full p-5 mt-5">
            <div className="flex flex-col lg:flex-row gap-x-3 lg:justify-between text-left lg:text-center lg:items-center">
              <Search
                placeholder={"Search by name, email or phone..."}
                onSearch={handleSearch}
                classname="mb-5 max-w-[300px]"
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
                    <DropdownMenuItem onClick={() => setStatusFilter("all")}>
                      All
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatusFilter("deleted")}>
                      Deleted
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {isFetching || loading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Phone Number</TableHead>
                    <TableHead className="text-center">Email Verified</TableHead>
                    <TableHead className="text-center">Phone Verified</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                        <TableCell key={j}>
                          <div className="w-full rounded-md">
                            <Skeleton className="h-4 w-full bg-gray-200" />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <PassengerList
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

export default Passengers;