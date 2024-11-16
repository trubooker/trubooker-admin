import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefKinProfileTable } from "./RefKinProfileTable";
import { SinglePassengerReferalData } from "@/constants";
import Pagination from "../Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

const RefKinProfile = () => {
  const loading: boolean = false;
  const isFetching: boolean = false;
  const userData: any = SinglePassengerReferalData;
  const [page, setPage] = useState(1);
  // const {
  //   isLoading: loading,
  //   data,
  //   isFetching,
  // } = useGetStudentReportQuery({ page, search: searchQuery });
  const totalPages = userData?.data?.instructors?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <div>
      <div className="flex xl:flex-row flex-col w-full gap-4">
        <div className="flex flex-col gap-4 xl:w-[40%]">
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-500">
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="my-5 space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Full name
                        </span>
                        <span className="font-medium text-sm">Grace Femi</span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Email address
                        </span>
                        <span className="font-medium text-sm">
                          gracefem@gmail.com
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Phone number
                        </span>
                        <span className="font-medium text-sm">
                          +234 813234567
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Password
                        </span>
                        <span className="font-medium text-sm">***********</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Address
                        </span>
                        <span className="font-medium text-sm">
                          No 1, 123 london street, USA
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Date of birth
                        </span>
                        <span className="font-medium text-sm">10/10/2003</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          City
                        </span>
                        <span className="font-medium text-sm">Abuja</span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Country
                        </span>
                        <span className="font-medium text-sm">Nigeria</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Gender
                        </span>
                        <span className="font-medium text-sm">Female</span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Referral code
                        </span>
                        <span className="font-medium text-sm">zWrtAq</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-500">
                  Next of Kin Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="my-5 space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Full name
                        </span>
                        <span className="font-medium text-sm">
                          Mrs Kemi Adewale
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Email address
                        </span>
                        <span className="font-medium text-sm">
                          kemiade222@gmail.com
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Phone number
                        </span>
                        <span className="font-medium text-sm">
                          +234 813234567
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Relationship
                        </span>
                        <span className="font-medium text-sm">Mother</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="xl:w-[60%] h-full bg-white rounded-lg w-full p-5">
          <div className="flex gap-x-3 items-center ps-3 mb-5">
            <div className="text-lg text-gray-500 font-bold">
              Referral Information
            </div>
            <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
              {userData.length}
            </div>
          </div>
          {isFetching || loading ? (
            <>
              <Table className="">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm">
                    <TableHead className="text-left font-bold w-1/3">
                      Name
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Date referred
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3].map((i) => (
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
            <ScrollArea className="h-[550px]">
              <RefKinProfileTable
                data={userData}
                isFetching={isFetching}
                loading={loading}
              />
              <ScrollBar orientation="vertical" />
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
  );
};

export default RefKinProfile;
