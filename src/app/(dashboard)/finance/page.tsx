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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/DualModal";
import { TransactionDetails } from "@/components/finance/transactionDetails";
import {
  useGetAgentsEarningsQuery,
  useGetDriversEarningsQuery,
  useGetFinancialReportQuery,
} from "@/redux/services/Slices/financeApiSlice";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import Spinner from "@/components/Spinner";
import { FaSpinner } from "react-icons/fa";

const Finance = () => {
  const [filterBy, setFilterBy] = useState("monthly"); // Default filter
  const router = useRouter();
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

  console.log("report: ", report);
  console.log("driverEarnings: ", driverEarnings);
  console.log("agentsEarnings: ", agentsEarnings);

  const revenue = report?.data;

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
    if (!agentsEarningsFetching && pageNumber !== driverPage) {
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
          {/* <TabsTrigger className="me-auto lg:w-full" value="refund">
            Refund Requests
          </TabsTrigger> */}
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
                <div className="mb-5 mt-10 gap-3">
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
                    <div className="">
                      <BarCharts
                        chartConfig={data?.chartConfigLine}
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
        {/* <TabsContent value="refund">
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
                  {driverfiltered?.length < 0 ? (
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
                                    <AvatarImage src={data?.profile_picture} />
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
        </TabsContent> */}
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
                          {agentfiltered?.map((data: any) => (
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
