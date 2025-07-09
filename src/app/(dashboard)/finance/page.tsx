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
import { chartConfigLine } from "@/constants";
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
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/DualModal";
import { TransactionDetails } from "@/components/finance/transactionDetails";
import {
  useGetAgentsEarningsQuery,
  useGetDriversEarningsQuery,
  useGetFinancialReportQuery,
  useGetRefundRequestQuery,
} from "@/redux/services/Slices/financeApiSlice";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { FaCaretDown } from "react-icons/fa";
import { AgentTransactionDetails } from "@/components/finance/agentTransactionDetails";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const Finance = () => {
  const [filterBy, setFilterBy] = useState("monthly");
  const [driverRefundRequestPage, setDriverRefundRequestPage] = useState(1);

  const [driverRefundSearchQuery, setDriverRefundSearchQuery] = useState("");
  const [passengerRefundRequestPage, setPassengerRefundRequestPage] =
    useState(1);
  const [passengerRefundSearchQuery, setPassengerRefundSearchQuery] =
    useState("");

  const [driverPage, setDriverPage] = useState(1);
  const [driverSearchQuery, setDriverSearchQuery] = useState("");

  const [agentPage, setAgentPage] = useState(1);
  const [agentSearchQuery, setAgentSearchQuery] = useState("");

  const {
    data: report,
    isLoading: reportLoading,
    isFetching: reportFetching,
  } = useGetFinancialReportQuery({ filter_by: filterBy });

  const {
    data: driverEarnings,
    isLoading: driverEarningsLoading,
    isFetching: driverEarningsFetching,
  } = useGetDriversEarningsQuery({
    page: driverPage,
    search: driverSearchQuery,
  });

  const {
    data: agentsEarnings,
    isLoading: agentsEarningsLoading,
    isFetching: agentsEarningsFetching,
  } = useGetAgentsEarningsQuery({ page: agentPage, search: agentSearchQuery });

  const {
    data: driverRefundRequest,
    isLoading: driverRefundRequestsLoading,
    isFetching: driverRefundRequestsFetching,
  } = useGetRefundRequestQuery({
    page: driverRefundRequestPage,
    search: driverRefundSearchQuery,
    type: "driver",
  });

  const {
    data: passengerRefundRequest,
    isLoading: passengerRefundRequestsLoading,
    isFetching: passengerRefundRequestsFetching,
  } = useGetRefundRequestQuery({
    page: passengerRefundRequestPage,
    search: passengerRefundSearchQuery,
    type: "passenger",
  });

  console.log("report: ", report);
  console.log("driverEarnings: ", driverEarnings);
  console.log("agentsEarnings: ", agentsEarnings);
  console.log("driver refund request: ", driverRefundRequest);
  console.log("passenger refund request: ", passengerRefundRequest);
  const revenue = report?.data;

  // DriverRefund request ----------------------------------------------------------

  const driverRefundRequests = driverRefundRequest?.data;
  const totalDriverRefundRequestsPages = driverRefundRequest?.meta?.last_page;
  const onDriverRefundRequestPageChange = (pageNumber: number) => {
    if (
      !driverRefundRequestsFetching &&
      pageNumber !== driverRefundRequestPage
    ) {
      setDriverRefundRequestPage(pageNumber);
    }
  };

  const [driverRefundfiltered, setDriverRefundFiltered] =
    useState(driverRefundRequests);
  useEffect(() => {
    if (driverRefundRequest) {
      setDriverRefundFiltered(driverRefundRequests);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverRefundRequests]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDriverRefundSearch = useCallback(
    debounce((query: string) => {
      setDriverRefundSearchQuery(query);
      setDriverRefundRequestPage(1);
    }, 300),
    []
  );
  const handleDriverRefundSearch = (query: string) => {
    debounceDriverRefundSearch(query);
  };

  // PassengerRefund request ----------------------------------------------------------

  const passengerRefundRequests = passengerRefundRequest?.data;
  const totalPassengerRefundRequestsPages =
    passengerRefundRequest?.meta?.last_page;
  const onPassengerRefundRequestPageChange = (pageNumber: number) => {
    if (
      !passengerRefundRequestsFetching &&
      pageNumber !== passengerRefundRequestPage
    ) {
      setPassengerRefundRequestPage(pageNumber);
    }
  };

  const [passengerRefundfiltered, setPassengerRefundFiltered] = useState(
    passengerRefundRequests
  );
  useEffect(() => {
    if (passengerRefundRequests) {
      setPassengerRefundFiltered(passengerRefundRequests);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passengerRefundRequests]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePassengerRefundSearch = useCallback(
    debounce((query: string) => {
      setPassengerRefundSearchQuery(query);
      setPassengerRefundRequestPage(1);
    }, 300),
    []
  );
  const handlePassengerRefundSearch = (query: string) => {
    debouncePassengerRefundSearch(query);
  };

  // Drivers Earnings ----------------------------------------------------------
  const totalDriverPages = driverEarnings?.meta?.last_page;
  const driverData = driverEarnings?.data;
  const onDriverPageChange = (pageNumber: number) => {
    if (!driverEarningsFetching && pageNumber !== driverPage) {
      setDriverPage(pageNumber);
    }
  };
  const [driverfiltered, setDriverFiltered] = useState(driverData);
  useEffect(() => {
    if (driverData) {
      setDriverFiltered(driverData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDriverSearch = useCallback(
    debounce((query: string) => {
      setDriverSearchQuery(query);
      setDriverPage(1);
    }, 300),
    []
  );
  const handleDriverSearch = (query: string) => {
    debounceDriverSearch(query);
  };

  // Connectors/agents earnings --------------------------------------------------
  const totalAgentPages = agentsEarnings?.meta?.last_page;
  const agentData = agentsEarnings?.data;
  const onAgentPageChange = (pageNumber: number) => {
    if (!agentsEarningsFetching && pageNumber !== agentPage) {
      setAgentPage(pageNumber);
    }
  };
  const [agentfiltered, setAgentFiltered] = useState(agentData);
  useEffect(() => {
    if (agentData) {
      setAgentFiltered(agentData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceAgentSearch = useCallback(
    debounce((query: string) => {
      setAgentSearchQuery(query);
      setAgentPage(1);
    }, 300),
    []
  );
  const handleAgentSearch = (query: string) => {
    debounceAgentSearch(query);
  };

  return (
    <div>
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="grid w-full lg:w-[700px] justify-start text-center h-full grid-rows-1 lg:grid-cols-4 gap-y-3 mb-5">
          <TabsTrigger className="me-auto lg:w-full" value="report">
            Financial Report
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="refund">
            Refund Requests
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="driver">
            Drivers Earnings
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="connector">
            Connectors Earnings
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
                                  {/* <span>{info?.currency}</span>{" "} */}
                                  <span>
                                    <CountUp
                                      prefix="₦ "
                                      end={Number(info?.balance)}
                                    />
                                  </span>
                                </>
                              ))
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Paystack Balance
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
                                prefix="₦ "
                                end={Number(revenue?.platform_earnings)}
                              />
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Platform Earnings
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
                                prefix="₦ "
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
                      className={`w-full h-32 border-none my-auto  bg-[--primary-orange]`}
                    >
                      <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                        <div className="flex gap-x-3 text-white items-center">
                          <span className="flex gap-x-2 items-center">
                            {reportLoading ? (
                              <Skeleton className="h-8 w-[50px] bg-gray-200" />
                            ) : (
                              <CountUp
                                prefix="₦ "
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
                                prefix="₦ "
                                end={Number(
                                  revenue?.total_passegener_pending_withdrawals
                                )}
                              />
                            )}
                          </span>
                        </div>
                        <span className="text-sm text-white font-normal">
                          Pending Passenger Payout
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <div className="mb-5 grid grid-cols-1 mt-10 w-full gap-3">
                  <div className="flex justify-end gap-3 mb-4">
                    {["daily", "monthly", "yearly"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setFilterBy(filter)}
                        className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
                          filterBy === filter
                            ? "bg-[#F6A74E] text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {filter.charAt(0).toUpperCase() + filter.slice(1)}
                      </button>
                    ))}
                  </div>
                  <ScrollArea className="w-full">
                    <div>
                      <BarCharts
                        chartConfig={chartConfigLine}
                        total_revenue={revenue?.revenue?.total_revenue}
                        graph_data={
                          Array.isArray(revenue?.revenue?.revenue_graph)
                            ? revenue?.revenue?.revenue_graph
                            : [revenue?.revenue?.revenue_graph]
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
        <TabsContent value="refund">
          <Separator />
          <div className="flex flex-col h-fit w-full mt-2">
            <div className="mt-5">
              <h1 className="text-xl font-semibold text-gray-500">
                Refund Requests
              </h1>
              <p className="text-sm text-gray-500">
                View and manage all refund requests from drivers and passengers.
              </p>
            </div>
            <Tabs defaultValue="driverRefundRequest" className="w-full">
              <TabsList className="grid w-full justify-start text-center h-full xl:grid-rows-1 grid-cols-2 gap-3 mt-5">
                <TabsTrigger
                  className="w-full shadow-sm shadow-gray-200 transition-all duration-200"
                  value="driverRefundRequest"
                >
                  Driver
                </TabsTrigger>
                <TabsTrigger
                  className="w-full shadow-sm shadow-gray-200 transition-all duration-200"
                  value="passengerRefundRequest"
                >
                  Passenger
                </TabsTrigger>
              </TabsList>
              <TabsContent value="driverRefundRequest" className="">
                <div className="bg-white rounded-xl p-5">
                  <div className="flex gap-x-3 items-center ps-3 mb-5">
                    <Search
                      placeholder={"Search..."}
                      onSearch={handleDriverRefundSearch}
                      classname="mb-5 max-w-[300px] lg:w-[500px]"
                    />
                  </div>
                  <ScrollArea className="w-full">
                    {driverRefundRequestsLoading ? (
                      <>
                        <Table className=" min-w-[700px] py-2">
                          <TableHeader>
                            <TableRow className="text-xs lg:text-sm text-center">
                              <TableHead className="font-bold w-1/4 text-left">
                                Narration
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Reference
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Amount
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Status
                              </TableHead>
                              <TableHead className="w-1/4 text-center">
                                Bank Details
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
                        {driverRefundRequests?.length > 0 ? (
                          <ScrollArea>
                            <Table className=" min-w-[900px] py-2">
                              <TableHeader>
                                <TableRow className="text-[10px] lg:text-sm text-center">
                                  <TableHead className="font-bold w-1/5 text-left">
                                    Narration
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Reference
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Amount
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Status
                                  </TableHead>
                                  <TableHead className="w-1/5 text-center">
                                    Bank Details
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {driverRefundfiltered?.map((data: any) => (
                                  <TableRow
                                    key={data.id}
                                    className="text-xs text-center lg:text-sm"
                                  >
                                    <TableCell className="w-1/5  py-5 font-medium text-left me-4">
                                      {data?.narration}
                                    </TableCell>
                                    <TableCell className="w-1/5 ">
                                      {data?.reference}
                                    </TableCell>
                                    <TableCell className="w-1/5 ">
                                      {data?.amount}
                                    </TableCell>
                                    <TableCell className="w-1/5 py-5">
                                      {data.status === "approved" ? (
                                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#CCFFCD] text-[#00B771]">
                                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                          <span className="font-semibold text-xs">
                                            Approved
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
                                            Declined
                                          </span>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="w-1/5  py-5 text-center">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <div className="gap-x-3 text-center flex cursor-pointer mx-auto justify-center items-center">
                                            Bank Details
                                            <FaCaretDown />
                                          </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="start"
                                          className="w-56 p-3"
                                        >
                                          <div className="flex flex-col gap-y-5">
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Account Number
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.account_number
                                                }
                                              </span>
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Bank Holder Name
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.bank_holder_name
                                                }
                                              </span>
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Bank Name
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.bank_name
                                                }
                                              </span>
                                            </div>
                                          </div>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
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
                  {totalDriverRefundRequestsPages > 1 && (
                    <div className="pt-10">
                      <Pagination
                        currentPage={driverRefundRequestPage}
                        totalPages={totalDriverRefundRequestsPages}
                        onPageChange={onDriverRefundRequestPageChange}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="passengerRefundRequest" className="">
                <div className="bg-white rounded-xl p-5">
                  <div className="flex gap-x-3 items-center ps-3 mb-5">
                    <Search
                      placeholder={"Search..."}
                      onSearch={handlePassengerRefundSearch}
                      classname="mb-5 max-w-[300px] lg:w-[500px]"
                    />
                  </div>
                  <ScrollArea className="w-full">
                    {passengerRefundRequestsLoading ? (
                      <>
                        <Table className=" min-w-[700px] py-2">
                          <TableHeader>
                            <TableRow className="text-xs lg:text-sm text-center">
                              <TableHead className="font-bold w-1/4 text-left">
                                Narration
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Reference
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Amount
                              </TableHead>
                              <TableHead className="font-bold w-1/4 text-center">
                                Status
                              </TableHead>
                              <TableHead className="w-1/4 text-center">
                                Bank Details
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
                        {passengerRefundRequests?.length > 0 ? (
                          <ScrollArea>
                            <Table className=" min-w-[900px] py-2">
                              <TableHeader>
                                <TableRow className="text-[10px] lg:text-sm text-center">
                                  <TableHead className="font-bold w-1/5 text-left">
                                    Narration
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Reference
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Amount
                                  </TableHead>
                                  <TableHead className="font-bold w-1/5 text-center">
                                    Status
                                  </TableHead>
                                  <TableHead className="w-1/5 text-center">
                                    Bank Details
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {passengerRefundfiltered?.map((data: any) => (
                                  <TableRow
                                    key={data.id}
                                    className="text-xs text-center lg:text-sm"
                                  >
                                    <TableCell className="w-1/5  py-5 font-medium text-left me-4">
                                      {data?.narration}
                                    </TableCell>
                                    <TableCell className="w-1/5 ">
                                      {data?.reference}
                                    </TableCell>
                                    <TableCell className="w-1/5 ">
                                      {data?.amount}
                                    </TableCell>
                                    <TableCell className="w-1/5 py-5">
                                      {data.status === "approved" ? (
                                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#CCFFCD] text-[#00B771]">
                                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                          <span className="font-semibold text-xs">
                                            Approved
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
                                            Declined
                                          </span>
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="w-1/5  py-5 text-center">
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <div className="gap-x-3 text-center flex cursor-pointer mx-auto justify-center items-center">
                                            Bank Details
                                            <FaCaretDown />
                                          </div>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="start"
                                          className="w-56 p-3"
                                        >
                                          <div className="flex flex-col gap-y-5">
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Account Number
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.account_number
                                                }
                                              </span>
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Bank Holder Name
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.bank_holder_name
                                                }
                                              </span>
                                            </div>
                                            <div className="flex flex-col gap-y-2">
                                              <span className="font-normal text-xs  text-start text-gray-500">
                                                Bank Name
                                              </span>
                                              <span className="font-medium text-sm capitalize">
                                                {
                                                  data?.payment_details
                                                    ?.bank_name
                                                }
                                              </span>
                                            </div>
                                          </div>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
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
                  {totalPassengerRefundRequestsPages > 1 && (
                    <div className="pt-10">
                      <Pagination
                        currentPage={passengerRefundRequestPage}
                        totalPages={totalPassengerRefundRequestsPages}
                        onPageChange={onPassengerRefundRequestPageChange}
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
        <TabsContent value="driver">
          <div className="bg-white rounded-xl p-5">
            <div className="flex gap-x-3 items-center ps-3 mb-5">
              <Search
                placeholder={"Search..."}
                onSearch={handleDriverSearch}
                classname="mb-5 max-w-[300px] lg:w-[500px]"
              />
            </div>
            <ScrollArea className="w-full">
              {driverEarningsLoading ? (
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
                  {driverfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[900px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Driver name
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Departure date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Arrival date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Earnings: <br /> ( Driver / Total )
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {driverfiltered?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className="w-1/6  py-5 font-medium text-left me-4">
                                <div className="w-full flex gap-x-3 items-center">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={data?.driver?.profile_picture}
                                    />
                                    <AvatarFallback>
                                      <IoPersonOutline />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                                    <span className="font-semibold">
                                      {data?.driver?.first_name}{" "}
                                      {data?.driver?.last_name}
                                    </span>
                                    <span className="font-medium text-xs capitalize">
                                      {data?.driver?.email}
                                    </span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6 ">
                                <div className="flex flex-col">
                                  <span className="text-left">
                                    {data?.trip_date?.departure_date}
                                  </span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Time:</span>{" "}
                                    {data?.trip_date?.departure_time}
                                  </small>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6 ">
                                <div className="flex flex-col">
                                  <span className="text-left">
                                    {data?.trip_date?.arrival_date}
                                  </span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Time:</span>{" "}
                                    {data?.trip_date?.arrival_time}
                                  </small>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {`${formatCurrency(
                                  data.driver_earning
                                )} / ${formatCurrency(data?.total_earning)}`}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                {data.status === "pending" && (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[110px] bg-[#FFF4E6] text-[#FFA500]">
                                    <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Pending
                                    </span>
                                  </div>
                                )}
                                {data.status === "active" && (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[110px] bg-[#E6F4FF] text-[#007AFF]">
                                    <span className="w-2 h-2 bg-[#007AFF] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Active
                                    </span>
                                  </div>
                                )}
                                {data.status === "completed" && (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[110px] bg-[#CCFFCD] text-[#00B771]">
                                    <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Completed
                                    </span>
                                  </div>
                                )}
                                {data.status === "cancelled" && (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[110px] bg-[#FFE6E6] text-[#FF4500]">
                                    <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Cancelled
                                    </span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="w-1/6  py-5 text-center">
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
                                  content={<TransactionDetails data={data} />}
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
            {totalDriverPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={driverPage}
                  totalPages={totalDriverPages}
                  onPageChange={onDriverPageChange}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="connector">
          <div className="bg-white rounded-xl p-5">
            <div className="flex gap-x-3 items-center ps-3 mb-5">
              <Search
                placeholder={"Search..."}
                onSearch={handleAgentSearch}
                classname="mb-5 max-w-[300px] lg:w-[500px]"
              />
            </div>
            <ScrollArea className="w-full">
              {agentsEarningsLoading ? (
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
                  {agentfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[700px] py-2">
                        <TableHeader>
                          <TableRow className="text-xs lg:text-sm text-center">
                            <TableHead className="font-bold w-1/6 text-left">
                              Username
                            </TableHead>
                            <TableHead className="font-bold w-1/7 text-center">
                              Referral count
                            </TableHead>
                            <TableHead className="w-1/7 font-bold text-center">
                              Requested amount
                            </TableHead>
                            <TableHead className="font-bold w-1/7 text-center">
                              Total Earnings
                            </TableHead>
                            <TableHead className="w-1/7 font-bold text-center">
                              Earning paid
                            </TableHead>
                            <TableHead className="w-1/7 font-bold text-center">
                              Status
                            </TableHead>
                            <TableHead className="w-1/7 font-bold text-center">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {agentfiltered?.map((data: any) => (
                            <TableRow
                              key={data?.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className=" py-5 font-medium text-left me-4">
                                <div className="w-full flex gap-x-3 items-center">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage
                                      src={data?.agent?.profile_image}
                                    />
                                    <AvatarFallback>
                                      <IoPersonOutline />
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                                    <span className="font-semibold">
                                      {data?.agent?.first_name}{" "}
                                      {data?.agent?.last_name}
                                    </span>
                                    <span className="font-medium text-xs">
                                      {data?.agent?.email}
                                    </span>
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className=" py-5 w-1/5">
                                {data.referral_count}
                              </TableCell>
                              <TableCell className=" py-5 w-1/5 text-[--primary]">
                                {formatCurrency(Number(data.requested_amount))}
                              </TableCell>
                              <TableCell className=" py-5 w-1/5">
                                {formatCurrency(Number(data.total_earning))}
                              </TableCell>
                              <TableCell className=" py-5 w-1/5">
                                {formatCurrency(Number(data.earned_amount))}
                              </TableCell>
                              <TableCell className="py-5">
                                {data.status === "approved" ? (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#CCFFCD] text-[#00B771]">
                                    <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Approved
                                    </span>
                                  </div>
                                ) : data.status === "pending" ? (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                                    <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Pending
                                    </span>
                                  </div>
                                ) : data.status === "declined" ? (
                                  <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                                    <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                                    <span className="font-semibold text-xs">
                                      Declined
                                    </span>
                                  </div>
                                ) : (
                                  ""
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
                                  content={
                                    <AgentTransactionDetails data={data} />
                                  }
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
            {totalAgentPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={agentPage}
                  totalPages={totalAgentPages}
                  onPageChange={onAgentPageChange}
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
