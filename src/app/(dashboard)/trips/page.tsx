"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/DualModal";
import { TransactionDetails } from "@/components/finance/transactionDetails";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { useGetAllTripsQuery } from "@/redux/services/Slices/tripsApiSlice";
import { debounce } from "lodash";
import { formatDistanceStrict } from "date-fns";
import Search from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

// Compute a human-readable duration from the trip's date/time fields.
// The API doesn't return a `duration` field, so we derive it.
const getTripDuration = (data: any) => {
  try {
    if (data?.duration) return data.duration;
    if (
      !data?.departureDate ||
      !data?.departureTime ||
      !data?.arrivalDate ||
      !data?.arrivalTime
    ) {
      return "N/A";
    }
    const dep = new Date(`${data.departureDate}T${data.departureTime}`);
    const arr = new Date(`${data.arrivalDate}T${data.arrivalTime}`);
    if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "N/A";
    return formatDistanceStrict(dep, arr);
  } catch {
    return "N/A";
  }
};

// Single source of truth for status colors, driven by the actual status value
// so the same status always looks identical across every tab.
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  active: { bg: "#CCFFCD", text: "#00B771", label: "Active" },
  completed: { bg: "#E6F4FF", text: "#1E90FF", label: "Completed" },
  upcoming: { bg: "#FFF4E6", text: "#FFA500", label: "Upcoming" },
  pending: { bg: "#FFF4E6", text: "#FFA500", label: "Pending" },
  cancelled: { bg: "#FFE6E6", text: "#FF4500", label: "Cancelled" },
  past: { bg: "#F1F1F1", text: "#6B7280", label: "Past" },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const key = (status || "").toLowerCase();
  const style =
    STATUS_STYLES[key] || {
      bg: "#F1F1F1",
      text: "#6B7280",
      label: status || "N/A",
    };
  return (
    <div
      className="flex items-center mx-auto gap-x-2 py-1 px-3 rounded-full justify-center min-w-[100px]"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: style.text }}
      ></span>
      <span className="font-semibold capitalize text-xs">{style.label}</span>
    </div>
  );
};

const Trips = () => {
  const router = useRouter();
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingSearchQuery, setUpcomingSearchQuery] = useState("");

  const [pastPage, setPastPage] = useState(1);
  const [pastSearchQuery, setPastSearchQuery] = useState("");

  const [completedPage, setCompletedPage] = useState(1);
  const [completedSearchQuery, setCompletedSearchQuery] = useState("");

  const {
    data: upcoming,
    isLoading: upcomingLoading,
    isFetching: upcomingFetching,
  } = useGetAllTripsQuery({
    status: "upcoming",
    page: upcomingPage,
  });
  const {
    data: past,
    isLoading: pastLoading,
    isFetching: pastFetching,
  } = useGetAllTripsQuery({
    status: "past",
    page: pastPage,
  });
  const {
    data: completed,
    isLoading: completedLoading,
    isFetching: completedFetching,
  } = useGetAllTripsQuery({
    status: "completed",
    page: completedPage,
  });

  

  console.log("upcoming", upcoming);
  console.log("completed", completed);
  console.log("past", past);
  // Upcoming ----------------------------------------------------------
  const totalUpcomingPage = upcoming?.result.meta?.previousPage;
  const upcomingData = upcoming?.result.data;
  const onUpcomingChange = (pageNumber: number) => {
    if (!upcomingLoading && pageNumber !== upcomingPage) {
      setUpcomingPage(pageNumber);
    }
  };
  const [upcomingfiltered, setUpcomingFiltered] = useState(upcomingData);
  useEffect(() => {
    if (upcomingData) {
      setUpcomingFiltered(upcomingData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceUpcomingSearch = useCallback(
    debounce((query: string) => {
      setUpcomingSearchQuery(query);
      setUpcomingPage(1);
    }, 300),
    []
  );
  const handleUpcomingSearch = (query: string) => {
    debounceUpcomingSearch(query);
  };

  // Past --------------------------------------------------
  const totalPastPages = past?.result.meta?.previousPage;
  const pastData = past?.result.data;
  const onPastPageChange = (pageNumber: number) => {
    if (!pastLoading && pageNumber !== pastPage) {
      setPastPage(pageNumber);
    }
  };
  const [pastfiltered, setPastFiltered] = useState(pastData);
  useEffect(() => {
    if (pastData) {
      setPastFiltered(pastData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePastSearch = useCallback(
    debounce((query: string) => {
      setPastSearchQuery(query);
      setPastPage(1);
    }, 300),
    []
  );
  const handlePastSearch = (query: string) => {
    debouncePastSearch(query);
  };

  // Completed --------------------------------------------------
  const totalCompletedPages = completed?.result.meta?.previousPage;
  const completedData = completed?.result.data;
  const onCompletedPageChange = (pageNumber: number) => {
    if (!completedLoading && pageNumber !== completedPage) {
      setCompletedPage(pageNumber);
    }
  };
  const [completedfiltered, setCompletedFiltered] = useState(completedData);
  useEffect(() => {
    if (completedData) {
      setCompletedFiltered(completedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedData]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceCompletedSearch = useCallback(
    debounce((query: string) => {
      setCompletedSearchQuery(query);
      setCompletedPage(1);
    }, 300),
    []
  );
  const handleCompletedSearch = (query: string) => {
    debounceCompletedSearch(query);
  };
  return (
    <div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full lg:w-[700px] justify-start text-center h-full grid-rows-1 lg:grid-cols-4 gap-y-3 mb-5">
          <TabsTrigger className="me-auto lg:w-full" value="upcoming">
            Upcoming Trips
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="past">
            Past Trips
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="completed">
            Completed Trips
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {upcomingFetching || upcomingLoading ? (
                <>
                  <Table className=" min-w-[700px] py-2">
                    <TableHeader>
                      <TableRow className="text-[10px] lg:text-sm text-center">
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Departure date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Arrival date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Booking closing Date & Time
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Duration
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Action
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
                <>
                  {upcomingfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[900px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Departure date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Arrival date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Booking closing Date & Time
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Duration
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {upcomingfiltered?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className="w-1/7 py-5 text-left">
                                <div className="flex flex-col">
                                  <span> {data.departureLocation}</span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.departureDate}, {data?.departureTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.departureLocation?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.departureLocation?.longitude}
                                  </small>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/7 py-5 text-left">
                                <div className="flex flex-col">
                                  <span>
                                    {data.arrivalDestination?.[0]?.name}
                                  </span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.arrivalDate}, {data?.arrivalTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.longitude}
                                  </small>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className=" py-5 text-center w-[100px]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="center"
                                    className="cursor-pointer"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/trips/${data?.id}`)
                                      }
                                      className="w-full text-center cursor-pointer"
                                    >
                                      View
                                    </DropdownMenuItem>
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
            {totalUpcomingPage > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={upcomingPage}
                  totalPages={totalUpcomingPage}
                  onPageChange={onUpcomingChange}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="past">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {pastFetching || pastLoading ? (
                <>
                  <Table className=" min-w-[700px] py-2">
                    <TableHeader>
                      <TableRow className="text-[10px] lg:text-sm text-center">
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Departure date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Arrival date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Booking closing Date & Time
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Duration
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Action
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
                <>
                  {pastfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[900px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Departure date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Arrival date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Booking closing Date & Time
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Duration
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pastfiltered?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className="w-1/7 py-5 text-left">
                                <div className="flex flex-col">
                                  <span> {data.departureLocation?.state}</span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.departureDate}, {data?.departureTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.departureLocation?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.departureLocation?.longitude}
                                  </small>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/7 py-5 text-left ">
                                <div className="flex flex-col">
                                  <span>
                                    {data.arrivalDestination?.[0]?.name}
                                  </span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.arrivalDate}, {data?.arrivalTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.longitude}
                                  </small>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className=" py-5 text-center w-[100px]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="center"
                                    className="cursor-pointer"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/trips/${data?.id}`)
                                      }
                                      className="w-full text-center cursor-pointer"
                                    >
                                      View
                                    </DropdownMenuItem>
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
            {totalPastPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={pastPage}
                  totalPages={totalPastPages}
                  onPageChange={onPastPageChange}
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {completedFetching || completedLoading ? (
                <>
                  <Table className=" min-w-[700px] py-2">
                    <TableHeader>
                      <TableRow className="text-[10px] lg:text-sm text-center">
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Departure date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-left">
                          Arrival date
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Booking closing Date & Time
                        </TableHead>
                        <TableHead className="text-xs font-bold w-1/6 text-center">
                          Duration
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Status
                        </TableHead>
                        <TableHead className="text-xs w-1/6 font-bold text-center">
                          Action
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
                <>
                  {completedfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className=" min-w-[700px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Departure date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-left">
                              Arrival date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Booking closing Date & Time
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Duration
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs w-1/6 font-bold text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {completedfiltered?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className="w-1/7 py-5 text-left">
                                <div className="flex flex-col">
                                  <span> {data.departureLocation?.state}</span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.departureDate}, {data?.departureTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.departureLocation?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.departureLocation?.longitude}
                                  </small>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/7 py-5 text-left ">
                                <div className="flex flex-col">
                                  <span>
                                    {data.arrivalDestination?.[0]?.address ??
                                      data.arrivalDestination?.[0]?.name}
                                  </span>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">Date:</span>{" "}
                                    {data.arrivalDate}, {data?.arrivalTime}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Latitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.latitude}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">
                                      Longitude:
                                    </span>{" "}
                                    {data.arrivalDestination?.[0]?.longitude}
                                  </small>
                                </div>
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6  py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className=" py-5 text-center w-[100px]">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="center"
                                    className="cursor-pointer"
                                  >
                                    <DropdownMenuItem
                                      onClick={() =>
                                        router.push(`/trips/${data?.id}`)
                                      }
                                      className="w-full text-center cursor-pointer"
                                    >
                                      View
                                    </DropdownMenuItem>
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
            {totalCompletedPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={completedPage}
                  totalPages={totalCompletedPages}
                  onPageChange={onCompletedPageChange}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trips;