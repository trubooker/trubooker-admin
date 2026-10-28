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
import { MoreHorizontal, MapPin, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  useGetAllTripsQuery,
  useGetTripRequestQuery,
  useGetAllNoShowsQuery,
} from "@/redux/services/Slices/tripsApiSlice";
import { debounce } from "lodash";
import { formatDistanceStrict } from "date-fns";
import Pagination from "@/components/Pagination";

// Compute a human-readable duration from the trip's date/time fields.
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

// ✅ Helper to determine if a trip's departure time has already passed
const isPastTrip = (trip: any) => {
  if (!trip?.departureDate) return false;
  
  // Combine date and time into a single string (e.g., "2026-09-21T15:57:00")
  const timeStr = trip.departureTime || "00:00:00";
  const departureDateTime = new Date(`${trip.departureDate}T${timeStr}`);
  
  if (isNaN(departureDateTime.getTime())) return false;
  
  return departureDateTime.getTime() < Date.now();
};

// Single source of truth for status colors.
const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  active: { bg: "#CCFFCD", text: "#00B771", label: "Active" },
  completed: { bg: "#E6F4FF", text: "#1E90FF", label: "Completed" },
  upcoming: { bg: "#FFF4E6", text: "#FFA500", label: "Upcoming" },
  pending: { bg: "#FFF4E6", text: "#FFA500", label: "Pending" },
  approved: { bg: "#CCFFCD", text: "#00B771", label: "Approved" },
  fulfilled: { bg: "#E6F0FF", text: "#0077FF", label: "Fulfilled" },
  declined: { bg: "#FFE6E6", text: "#FF4500", label: "Past Request" },
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

// Filter options for the Trip Requests tab.
const REQUEST_STATUS_FILTERS: {
  label: string;
  value?: string | string[];
}[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Fulfilled", value: "fulfilled" },
  { label: "Past Requests", value: ["declined", "cancelled"] },
];

// Filter options for the Driver Refunds (No-Shows) tab.
const NO_SHOW_STATUS_FILTERS: { label: string; value?: string }[] = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Declined", value: "declined" },
];

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-NG", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const CoordinatePill = ({
  lat,
  lng,
}: {
  lat?: number | string;
  lng?: number | string;
}) => {
  const hasCoords =
    lat !== undefined && lat !== null && lng !== undefined && lng !== null;

  if (!hasCoords) {
    return <span className="text-gray-400">—</span>;
  }

  const url = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-x-1 px-2 py-1 rounded-md bg-[#E6F4FF] text-[#1E90FF] hover:bg-[#CFE9FF] transition text-xs font-medium"
      title={`Open ${lat}, ${lng} in Google Maps`}
    >
      <MapPin size={12} />
      <span>
        {Number(lat).toFixed(5)}, {Number(lng).toFixed(5)}
      </span>
    </a>
  );
};

const Trips = () => {
  const router = useRouter();

  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingSearchQuery, setUpcomingSearchQuery] = useState("");

  const [requestPage, setRequestPage] = useState(1);
  const [requestStatus, setRequestStatus] = useState<
    string | string[] | undefined
  >(undefined);

  const [noShowPage, setNoShowPage] = useState(1);
  const [noShowStatus, setNoShowStatus] = useState<string | undefined>(
    "pending"
  );

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

  const {
    data: requests,
    isLoading: requestsLoading,
    isFetching: requestsFetching,
  } = useGetTripRequestQuery({
    status: requestStatus,
    page: requestPage,
    limit: 20,
  });

  const {
    data: noShows,
    isLoading: noShowsLoading,
    isFetching: noShowsFetching,
  } = useGetAllNoShowsQuery({
    status: noShowStatus,
    page: noShowPage,
    limit: 20,
  });

  // Upcoming ----------------------------------------------------------
  const totalUpcomingPage = upcoming?.result?.meta?.pageCount;
  const upcomingData = upcoming?.result?.data;
  const onUpcomingChange = (pageNumber: number) => {
    if (!upcomingLoading && pageNumber !== upcomingPage) {
      setUpcomingPage(pageNumber);
    }
  };

  // Trip Requests --------------------------------------------------
  const requestData = requests?.result?.data;
  const totalRequestPages = requests?.result?.meta?.pageCount;
  const onRequestPageChange = (pageNumber: number) => {
    if (!requestsLoading && pageNumber !== requestPage) {
      setRequestPage(pageNumber);
    }
  };
  const onRequestStatusChange = (value?: string | string[]) => {
    setRequestStatus(value);
    setRequestPage(1);
  };

  // Driver Refunds (No-Shows) --------------------------------------------------
  const noShowData = noShows?.result?.data;
  const totalNoShowPages = noShows?.result?.meta?.pageCount;
  const onNoShowPageChange = (pageNumber: number) => {
    if (!noShowsLoading && pageNumber !== noShowPage) {
      setNoShowPage(pageNumber);
    }
  };
  const onNoShowStatusChange = (value?: string) => {
    setNoShowStatus(value);
    setNoShowPage(1);
  };

  const [upcomingfiltered, setUpcomingFiltered] = useState(upcomingData);
  useEffect(() => {
    if (upcomingData) {
      // ✅ Filter out any trip whose departure time has already passed
      const strictlyUpcoming = upcomingData.filter(
        (trip: any) => !isPastTrip(trip)
      );
      setUpcomingFiltered(strictlyUpcoming);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [upcomingData]);

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
  const totalPastPages = past?.result?.meta?.pageCount;
  const pastData = past?.result?.data;
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
  const totalCompletedPages = completed?.result?.meta?.pageCount;
  const completedData = completed?.result?.data;
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

  const isRequestFilterActive = (value?: string | string[]): boolean => {
    if (value === undefined && requestStatus === undefined) return true;
    if (Array.isArray(value) && Array.isArray(requestStatus)) {
      return (
        value.length === requestStatus.length &&
        value.every((v) => (requestStatus as string[]).includes(v))
      );
    }
    return value === requestStatus;
  };

  return (
    <div>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full lg:w-[900px] justify-start text-center h-full grid-rows-1 lg:grid-cols-5 gap-y-3 mb-5">
          <TabsTrigger className="me-auto lg:w-full" value="upcoming">
            Upcoming Trips
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="past">
            Past Trips
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="completed">
            Completed Trips
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="requests">
            Trip Requests
          </TabsTrigger>
          <TabsTrigger className="me-auto lg:w-full" value="no-shows">
            Driver Refunds
          </TabsTrigger>
        </TabsList>

        {/* ============================== UPCOMING ============================== */}
        <TabsContent value="upcoming">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {upcomingFetching || upcomingLoading ? (
                <Table className="min-w-[700px] py-2">
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
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-1/7 bg-gray-400" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {upcomingfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className="min-w-[900px] py-2">
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
                                  <span>{data.departureLocation}</span>
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
                              <TableCell className="w-1/6 py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6 py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className="py-5 text-center w-[100px]">
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

        {/* ============================== PAST ============================== */}
        <TabsContent value="past">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {pastFetching || pastLoading ? (
                <Table className="min-w-[700px] py-2">
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
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-1/7 bg-gray-400" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {pastfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className="min-w-[900px] py-2">
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
                                  <span>{data.departureLocation?.state}</span>
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
                              <TableCell className="w-1/6 py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6 py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className="py-5 text-center w-[100px]">
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

        {/* ============================== COMPLETED ============================== */}
        <TabsContent value="completed">
          <div className="bg-white rounded-xl p-5">
            <ScrollArea className="w-full">
              {completedFetching || completedLoading ? (
                <Table className="min-w-[700px] py-2">
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
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-1/7 bg-gray-400" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {completedfiltered?.length > 0 ? (
                    <ScrollArea>
                      <Table className="min-w-[700px] py-2">
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
                                  <span>{data.departureLocation?.state}</span>
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
                              <TableCell className="w-1/6 py-5">
                                {data.bookingClosingDate},{" "}
                                {data?.bookingClosingTime}{" "}
                              </TableCell>
                              <TableCell className="w-1/6 py-5">
                                {getTripDuration(data)}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>
                              <TableCell className="py-5 text-center w-[100px]">
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

        {/* ============================== REQUESTS ============================== */}
        <TabsContent value="requests">
          <div className="bg-white rounded-xl p-5">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {REQUEST_STATUS_FILTERS.map((f) => {
                const active = isRequestFilterActive(f.value);
                return (
                  <button
                    key={f.label}
                    onClick={() => onRequestStatusChange(f.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      active
                        ? "bg-[#00B771] text-white border-[#00B771]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <ScrollArea className="w-full">
              {requestsFetching || requestsLoading ? (
                <Table className="min-w-[700px] py-2">
                  <TableHeader>
                    <TableRow className="text-[10px] lg:text-sm text-center">
                      <TableHead className="text-xs font-bold w-1/5 text-left">
                        Requester
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/5 text-left">
                        Route
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Requested date
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Note
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4, 5, 6].map((j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-1/7 bg-gray-400" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {requestData?.length > 0 ? (
                    <ScrollArea>
                      <Table className="min-w-[900px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/5 text-left">
                              Requester
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/5 text-left">
                              Route
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Requested date
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Note
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {requestData?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className="w-1/5 py-5 text-left">
                                <div className="flex items-center gap-x-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={data.requester?.profileImage}
                                    />
                                    <AvatarFallback>
                                      <IoPersonOutline />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {data.requester?.firstName}{" "}
                                      {data.requester?.lastName}
                                    </span>
                                    <small className="font-light">
                                      {data.requester?.email}
                                    </small>
                                  </div>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/5 py-5 text-left">
                                <div className="flex flex-col">
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">From:</span>{" "}
                                    {data.origin}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">To:</span>{" "}
                                    {data.destination}
                                  </small>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <div className="flex flex-col">
                                  <span>{data.requestedDate}</span>
                                  <small className="mt-1 font-light">
                                    {data.seats}{" "}
                                    {data.seats === 1 ? "seat" : "seats"}
                                  </small>
                                </div>
                              </TableCell>

                              <TableCell className="w-1/6 py-5 max-w-[160px] truncate">
                                {data.note || "—"}
                              </TableCell>

                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>

                              <TableCell className="py-5 text-center w-[100px]">
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
                                        router.push(
                                          `/trips/trip-requests/${data?.id}`
                                        )
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
            {totalRequestPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={requestPage}
                  totalPages={totalRequestPages}
                  onPageChange={onRequestPageChange}
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* ============================== DRIVER REFUNDS (NO-SHOWS) ============================== */}
        <TabsContent value="no-shows">
          <div className="bg-white rounded-xl p-5">
            {/* Status filter */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {NO_SHOW_STATUS_FILTERS.map((f) => {
                const active = noShowStatus === f.value;
                return (
                  <button
                    key={f.label}
                    onClick={() => onNoShowStatusChange(f.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                      active
                        ? "bg-[#00B771] text-white border-[#00B771]"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>

            <ScrollArea className="w-full">
              {noShowsFetching || noShowsLoading ? (
                <Table className="min-w-[900px] py-2">
                  <TableHeader>
                    <TableRow className="text-[10px] lg:text-sm text-center">
                      <TableHead className="text-xs font-bold w-1/5 text-left">
                        Driver
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/5 text-left">
                        Passenger
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/5 text-left">
                        Trip route
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Reported at
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Driver location
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-bold w-1/6 text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-4 w-full bg-gray-400" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <>
                  {noShowData?.length > 0 ? (
                    <ScrollArea>
                      <Table className="min-w-[1100px] py-2">
                        <TableHeader>
                          <TableRow className="text-[10px] lg:text-sm text-center">
                            <TableHead className="text-xs font-bold w-1/5 text-left">
                              Driver
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/5 text-left">
                              Passenger
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/5 text-left">
                              Trip route
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Reported at
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Driver location
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Status
                            </TableHead>
                            <TableHead className="text-xs font-bold w-1/6 text-center">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {noShowData?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              {/* Driver */}
                              <TableCell className="w-1/5 py-5 text-left">
                                <div className="flex items-center gap-x-3">
                                  <Avatar className="h-9 w-9">
                                    <AvatarImage
                                      src={data.driver?.profileImage}
                                    />
                                    <AvatarFallback>
                                      <IoPersonOutline />
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {data.driver?.firstName}{" "}
                                      {data.driver?.lastName}
                                    </span>
                                    <small className="font-light">
                                      {data.driver?.email}
                                    </small>
                                    {data.driver?.phone && (
                                      <small className="font-light text-gray-500">
                                        {data.driver.phone}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              {/* Passenger */}
                              <TableCell className="w-1/5 py-5 text-left">
                                <div className="flex flex-col">
                                  <span className="font-medium">
                                    {data.passenger?.firstName}{" "}
                                    {data.passenger?.lastName}
                                  </span>
                                  <small className="font-light">
                                    {data.passenger?.email}
                                  </small>
                                  {data.booking?.bookingCode && (
                                    <small className="font-light text-gray-500">
                                      Booking: {data.booking.bookingCode}
                                    </small>
                                  )}
                                </div>
                              </TableCell>

                              {/* Trip route */}
                              <TableCell className="w-1/5 py-5 text-left">
                                <div className="flex flex-col">
                                  <small className="font-light flex gap-x-2">
                                    <span className="font-normal">From:</span>{" "}
                                    {data.trip?.departureLocation?.name ||
                                      data.trip?.departureLocation ||
                                      "—"}
                                  </small>
                                  <small className="mt-1 font-light flex gap-x-2">
                                    <span className="font-normal">To:</span>{" "}
                                    {data.trip?.arrivalDestination?.[0]?.name ||
                                      data.trip?.arrivalDestination?.name ||
                                      "—"}
                                  </small>
                                  {data.trip?.departureDate && (
                                    <small className="mt-1 font-light text-gray-500">
                                      {data.trip.departureDate}{" "}
                                      {data.trip.departureTime}
                                    </small>
                                  )}
                                </div>
                              </TableCell>

                              {/* Reported at */}
                              <TableCell className="w-1/6 py-5">
                                <div className="flex flex-col items-center gap-y-1">
                                  <span className="inline-flex items-center gap-x-1 text-xs text-gray-600">
                                    <Clock size={12} />
                                    {formatDateTime(
                                      data.reportedAt || data.createdAt
                                    )}
                                  </span>
                                </div>
                              </TableCell>

                              {/* Location — clickable */}
                              <TableCell className="w-1/6 py-5">
                                <div className="flex flex-col items-center gap-y-1">
                                  <CoordinatePill
                                    lat={data.latitude}
                                    lng={data.longitude}
                                  />
                                  <small className="text-[10px] text-gray-400">
                                    Tap to open map
                                  </small>
                                </div>
                              </TableCell>

                              {/* Status */}
                              <TableCell className="w-1/6 py-5">
                                <StatusBadge status={data?.status} />
                              </TableCell>

                              {/* Action */}
                              <TableCell className="py-5 text-center w-[100px]">
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
                                        router.push(
                                          `/trips/driver-refunds/${data?.id}`
                                        )
                                      }
                                      className="w-full text-center cursor-pointer"
                                    >
                                      View details
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
            {totalNoShowPages > 1 && (
              <div className="pt-10">
                <Pagination
                  currentPage={noShowPage}
                  totalPages={totalNoShowPages}
                  onPageChange={onNoShowPageChange}
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