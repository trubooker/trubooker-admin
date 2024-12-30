"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CountUp from "react-countup";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { IoCarOutline } from "react-icons/io5";
import { TbUserStar } from "react-icons/tb";
import { HiOutlineUserGroup } from "react-icons/hi";
import Notification from "@/components/Notification";
import { LineChartDisplay } from "@/components/charts/LineChart";
import * as data from "@/constants";
import { useGetDashboardQuery } from "@/redux/services/Slices/dashboardApiSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import { VscCircleFilled } from "react-icons/vsc";
import Overview from "@/components/TripOverview";
import { FaArrowUp } from "react-icons/fa";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [page, setPage] = useState(1);

  const {
    data: info,
    isLoading: loading,
    isFetching,
  } = useGetDashboardQuery({ page });
  console.log(info);

  const totalPages = info?.data?.active_trips?.last_page;
  const userData = info?.data?.active_trips?.data || [];
  const overview = info?.data?.overviews;
  const revenue = info?.data;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };
  const router = useRouter();

  // const [sortConfig, setSortConfig] = useState<{
  //   column: string;
  //   order: string;
  // } | null>(null);

  // const sortedData = [...userData].sort((a, b) => {
  //   if (!sortConfig) return 0;
  //   const { column, order } = sortConfig;
  //   const valA = a[column as keyof typeof a];
  //   const valB = b[column as keyof typeof b];
  //   if (valA < valB) return order === "asc" ? -1 : 1;
  //   if (valA > valB) return order === "asc" ? 1 : -1;
  //   return 0;
  // });
  // const handleSort = (column: string) => {
  //   setSortConfig((prev) => {
  //     if (prev?.column === column) {
  //       return { column, order: prev.order === "asc" ? "desc" : "asc" };
  //     }
  //     return { column, order: "asc" };
  //   });
  // };

  return (
    <div className="flex flex-col h-fit w-full  gap-4">
      <div className="flex flex-col xl:flex-row w-full gap-4">
        <div className="grid grid-rows-1 lg:grid-cols-1 w-full">
          <div className="w-full">
            <div className="grid grid-rows-1 gap-4 lg:grid-cols-3">
              <Link
                href="/passengers"
                className="hover:shadow-xl transition-all ease-in-out duration-300"
              >
                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <HiOutlineUserGroup className="w-8 h-8" />
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          <CountUp end={Number(revenue?.total_passengers)} />
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Passengers
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href="/drivers"
                className="hover:shadow-xl transition-all ease-in-out duration-300"
              >
                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary-orange]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <IoCarOutline className="w-8 h-8" />
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          <CountUp end={Number(revenue?.total_drivers)} />
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Drivers
                    </span>
                  </CardContent>
                </Card>
              </Link>

              <Link
                href="/connector"
                className="hover:shadow-xl transition-all ease-in-out duration-300"
              >
                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <TbUserStar className="w-8 h-8" />
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          <CountUp end={Number(revenue?.total_agents)} />
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Connectors
                    </span>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
          <div className="grid xl:grid-cols-2 grid-rows-1 my-5 gap-3">
            <ScrollArea className="w-full">
              <div className="">
                <LineChartDisplay
                  chartConfig={data?.chartConfigLine}
                  total_revenue={revenue?.total_revenue}
                  graph_data={
                    Array.isArray(revenue?.graph_data)
                      ? revenue?.graph_data
                      : [revenue?.graph_data]
                  }
                />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <Overview data={overview} loading={loading} />
          </div>
        </div>
        <div className="xl:w-[40%]">
          <Notification />
        </div>
      </div>
      <div className="bg-white rounded-xl p-5">
        <div className="flex gap-x-3 items-center ps-3 mb-5">
          <span className="font-bold">Active Trips</span>
          <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
            {userData?.length}
          </div>
        </div>
        <ScrollArea className="w-full">
          {loading ? (
            <>
              <Table className=" min-w-[700px] py-2">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm text-center">
                    <TableHead className="font-bold w-1/4 text-left">
                      Drivers
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Departure
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Arrival
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Status
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
            <ScrollArea>
              <Table className=" min-w-[700px] py-2">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm text-center">
                    <TableHead className="font-bold w-1/4 text-left">
                      Drivers
                    </TableHead>
                    <TableHead
                      // onClick={() => handleSort("departure")}
                      className="font-bold w-1/4 text-center"
                    >
                      <span className="flex gap-x-3 items-center cursor-pointer justify-left">
                        Departure
                        {/* <FaArrowUp
                          className={`transition-transform duration-300 ${
                            sortConfig?.column === "departure" &&
                            sortConfig?.order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        /> */}
                      </span>
                    </TableHead>
                    <TableHead
                      // onClick={() => handleSort("arrival")}
                      className="font-bold w-1/4 text-center"
                    >
                      <span className="flex gap-x-3 items-center cursor-pointer justify-left">
                        Arrival
                        {/* <FaArrowUp
                          className={`transition-transform duration-300 ${
                            sortConfig?.column === "arrival" &&
                            sortConfig?.order === "desc"
                              ? "rotate-180"
                              : ""
                          }`}
                        /> */}
                      </span>
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Status
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* {sortedData!.map((data: any) => ( */}
                  {userData?.map((data: any) => (
                    <TableRow
                      key={data.id}
                      className="text-xs text-center lg:text-sm"
                    >
                      <TableCell className=" py-5 font-medium text-left me-4">
                        <div className="w-full flex gap-x-3 items-center">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={data?.profile_picture} />
                            <AvatarFallback>
                              <IoPersonOutline />
                            </AvatarFallback>
                          </Avatar>
                          <span className="w-full flex flex-col xl:flex-row gap-x-2 gap-y-1 text-gray-500">
                            <span className="capitalize">
                              {data.driver?.name}{" "}
                            </span>
                            {/* <span>{data.last_name}</span> */}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="w-1/7 py-5 text-left">
                        <div className="flex flex-col">
                          <span> {data.departure_location}</span>
                          <small className="mt-1 font-light flex gap-x-2">
                            <span className="font-normal">Date:</span>{" "}
                            {data.departure_date}
                          </small>
                        </div>
                      </TableCell>

                      <TableCell className="w-1/7 py-5 text-left ">
                        <div className="flex flex-col">
                          <span> {data.arrival_location?.address}</span>
                          <small className="mt-1 font-light flex gap-x-2">
                            <span className="font-normal">Date:</span>{" "}
                            {data.arrival_date}, {data?.arrival_time}
                          </small>
                          <small className="mt-1 font-light flex gap-x-2">
                            <span className="font-normal">Latitude:</span>{" "}
                            {data.arrival_location?.latitude}
                          </small>
                          <small className="mt-1 font-light flex gap-x-2">
                            <span className="font-normal">Longitude:</span>{" "}
                            {data.arrival_location?.longitude}
                          </small>
                        </div>
                      </TableCell>

                      <TableCell className=" py-5">
                        {data.status === "active" ? (
                          <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                            <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                            <span className="font-semibold text-xs">
                              {data?.status}
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                            <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                            <span className="font-semibold text-xs">
                              {data.status}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className=" py-5">
                        <Button
                          onClick={() =>
                            router.push(
                              `/drivers/${data.driver?.id}/trip-detail/${data.id}`
                            )
                          }
                          className="rounded-xl  text-blue-600 hover:bg-blue-100 bg-blue-200 py-3 text-xs"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
    </div>
  );
};

export default Dashboard;
