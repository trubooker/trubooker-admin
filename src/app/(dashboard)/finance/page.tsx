"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import * as data from "@/constants";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import CountUp from "react-countup";
import { IoPersonOutline } from "react-icons/io5";
import Pagination from "@/components/Pagination";
import Notifications from "@/components/Notification";
import { BarCharts } from "@/components/charts/BarChart";
import debounce from "lodash/debounce";
import Search from "@/components/SearchBar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/DualModal";
import { TransactionDetails } from "@/components/finance/transactionDetails";
import {
  useGetDriversEarningsQuery,
  useGetFinancialReportQuery,
  useGetTransactionHistoryQuery,
} from "@/redux/services/Slices/financeApiSlice";
import { Span } from "next/dist/trace";
import Image from "next/image";

const Finance = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const {
    data: report,
    isLoading: reportLoading,
    isFetching: reportFetching,
  } = useGetFinancialReportQuery(null);

  const {
    data: history,
    isLoading: historyLoading,
    isFetching: historyFetching,
  } = useGetTransactionHistoryQuery({ page, search: searchQuery });

  const {
    data: driverEarnings,
    isLoading: driverEarningsLoading,
    isFetching: driverEarningsFetching,
  } = useGetDriversEarningsQuery(null);

  console.log("history: ", history);
  console.log("report: ", report);
  console.log("driverEarnings: ", driverEarnings);

  const totalPages = history?.meta?.last_page;
  const revenue = report?.data;
  const expense = history?.data;
  const onPageChange = (pageNumber: number) => {
    if (!historyFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  const [filtered, setFiltered] = useState(expense);

  useEffect(() => {
    if (expense) {
      setFiltered(expense);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expense]);

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
    <div>
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-[400px] mb-10 grid-cols-2">
          <TabsTrigger value="report" className="font-bold">
            Financial Report
          </TabsTrigger>
          <TabsTrigger value="history" className="font-bold">
            Transaction History
          </TabsTrigger>
        </TabsList>
        <TabsContent className="w-full" value="report">
          <div className="flex flex-col h-fit w-full  gap-4">
            <div className="flex flex-col xl:flex-row w-full gap-4">
              <div className="grid grid-rows-1 lg:grid-cols-1 w-full">
                <div className="w-full">
                  <div className="grid grid-rows-1 gap-4 lg:grid-cols-3">
                    <Card
                      className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                    >
                      <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                        <div className="flex gap-x-3 text-white items-center">
                          <span className="flex gap-x-2 items-center">
                            {reportLoading ? (
                              <Skeleton className="h-8 w-[50px] bg-gray-200" />
                            ) : (
                              revenue?.total_balance?.map((info: any) => (
                                <>
                                  <span>{info?.currency}</span>{" "}
                                  <span>
                                    <CountUp end={Number(info?.balance)} />
                                  </span>
                                </>
                              ))
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Total Balance
                        </span>
                      </CardContent>
                    </Card>

                    <Card
                      className={`w-full h-32 border-none my-auto  bg-[--primary-orange]`}
                    >
                      <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                        <div className="flex gap-x-3 text-white items-center">
                          <span className="flex gap-x-2 items-center">
                            {reportLoading ? (
                              <Skeleton className="h-8 w-[50px] bg-gray-200" />
                            ) : (
                              <CountUp
                                end={Number(
                                  revenue?.total_agent_pending_withdrawals
                                )}
                              />
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Pending Connector Payout
                        </span>
                      </CardContent>
                    </Card>

                    <Card
                      className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                    >
                      <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                        <div className="flex gap-x-3 text-white items-center">
                          <span className="flex gap-x-2 items-center">
                            {reportLoading ? (
                              <Skeleton className="h-8 w-[50px] bg-gray-200" />
                            ) : (
                              <CountUp
                                end={Number(
                                  revenue?.total_driver_pending_withdrawals
                                )}
                              />
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Pending Drivers Payout
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="my-5 gap-3">
                  <ScrollArea className="w-full">
                    <div className="">
                      <BarCharts
                        chartConfig={data?.chartConfigLine}
                        total_revenue={revenue?.total_revenue}
                        graph_data={
                          data?.chartDataLine.length > 0
                            ? data?.chartDataLine
                            : revenue?.graph_data
                        }
                      />
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
              <div className="xl:w-[40%]">
                <Notifications />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="history">
          <div className="bg-white rounded-xl p-5">
            <div className="flex gap-x-3 items-center ps-3 mb-5">
              <Search
                placeholder={"Search..."}
                onSearch={handleSearch}
                classname="mb-5 max-w-[300px] lg:w-[500px]"
              />
            </div>
            <ScrollArea className="w-full">
              {historyLoading ? (
                <>
                  <Table className=" min-w-[700px] py-2">
                    <TableHeader>
                      <TableRow className="text-xs lg:text-sm text-center">
                        <TableHead className="font-bold w-1/4 text-left">
                          Date
                        </TableHead>
                        <TableHead className="font-bold w-1/4 text-center">
                          Username
                        </TableHead>
                        <TableHead className="font-bold w-1/4 text-center">
                          Earnings
                        </TableHead>
                        <TableHead className="font-bold w-1/4 text-center">
                          Status
                        </TableHead>
                        <TableHead className="w-1/4 text-center">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <TableRow key={i}>
                          {[1, 2, 3, 4].map((i) => (
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
                <>
                  {filtered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[700px] py-2">
                        <TableHeader>
                          <TableRow className="text-xs lg:text-sm text-center">
                            <TableHead className="font-bold w-1/4 text-left">
                              Date
                            </TableHead>
                            <TableHead className="font-bold w-1/4 text-left">
                              Username
                            </TableHead>
                            <TableHead className="font-bold w-1/4 text-center">
                              Earnings
                            </TableHead>
                            <TableHead className="font-bold w-1/4 text-center">
                              Status
                            </TableHead>
                            <TableHead className="w-1/4 font-bold text-center">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filtered?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className=" py-5 w-1/5 text-left">
                                {data.created_at}
                              </TableCell>
                              <TableCell className=" py-5 font-medium text-left me-4">
                                <div className="w-full flex gap-x-3 items-center">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={data?.profile_picture} />
                                    <AvatarFallback>
                                      <IoPersonOutline />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                                    <span className="font-semibold">
                                      {data.name}
                                    </span>
                                    <span className="font-medium text-xs capitalize">
                                      {data.role}
                                    </span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className=" py-5 w-1/5">
                                {data.earnings}
                              </TableCell>
                              <TableCell className="py-5">
                                {data.status === "paid" ? (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                                    <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Paid
                                    </span>
                                  </div>
                                ) : data.status === "pending" ? (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                                    <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Pending
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                                    <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Failed
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className=" py-5 text-center w-[100px]">
                                <Modal
                                  trigger={
                                    <Button
                                      variant={"outline"}
                                      size={"sm"}
                                      className="text-xs text-blue-500 hover:text-blue-500 cursor-pointer font-medium"
                                    >
                                      View Details
                                    </Button>
                                  }
                                  title={"Transaction details"}
                                  description={""}
                                  content={<TransactionDetails />}
                                  classname="hidden"
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  ) : (
                    <div className="flex items-center w-full h-[357px] flex-col justify-center">
                      <Image
                        src={"/nodata.svg"}
                        alt=""
                        width={200}
                        height={200}
                        className="object-cover me-5"
                      />
                      <h1 className="mt-8 text-lg text-center font-semibold">
                        No Data
                      </h1>
                    </div>
                  )}
                </>
              )}
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finance;
