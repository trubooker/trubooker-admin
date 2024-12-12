"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceStrict, format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MapComponent from "@/components/Driver/Trip/GoogleMaps";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetTripDetailsQuery } from "@/redux/services/Slices/driverApiSlice";
import Goback from "@/components/Goback";
import { formatCurrency } from "@/lib/utils";
import { FaCaretDown } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Timeline from "@/components/Driver/Trip/Timeline";

const Slug = () => {
  const params = useParams();
  const id = String(params.tripId);
  const { isLoading: loading, data, isFetching } = useGetTripDetailsQuery(id);
  const tripData = data?.data;
  const [page, setPage] = useState(1);
  const totalPages = tripData?.data?.active_trips?.last_page;
  const details = tripData?.trip_details; //array
  const passengers = tripData?.passengers; //array

  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <div>
      {isFetching || loading ? (
        <div>
          <Skeleton className="h-8 bg-gray-200 w-[250px]" />

          <div className="w-full grid lg:grid-cols-2 grid-cols-1 pt-5 mt-5 gap-8">
            <div className="w-full rounded-md">
              <div className="flex flex-col space-y-3">
                <Skeleton className="bg-gray-200 h-[125px] w-full rounded-xl" />
              </div>
            </div>
            <div className="w-full rounded-md lg:row-span-2">
              <div className="flex flex-col space-y-3">
                <Skeleton className="bg-gray-200 h-[275px] w-full rounded-xl" />
              </div>
            </div>
            <div className="w-full rounded-md">
              <div className="flex flex-col space-y-3">
                <Skeleton className="bg-gray-200 h-[125px] w-full rounded-xl" />
              </div>
            </div>
          </div>

          <Table className="mt-5">
            <TableBody>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <TableRow key={i}>
                  {[1, 2, 3].map((i) => (
                    <TableCell key={i}>
                      <div>
                        <div className="w-full rounded-md">
                          <div>
                            <Skeleton className="h-4 w-1/7 bg-gray-200" />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <Goback
            formerPage={`Driver`}
            presentPage={`Trip Id - #${details?.id}`}
          />

          <div className="flex xl:flex-row flex-col w-full mt-5 gap-4">
            <div className="flex flex-col gap-4 xl:w-[40%]">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-500">
                      Trip details
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div className="mb-5 space-y-6">
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs  text-start text-gray-500">
                              Departure
                            </span>
                            <span className="font-medium text-sm capitalize">
                              {details?.departure_location === null ||
                              loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                details?.departure_location
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Destination
                            </span>
                            <span className="font-medium text-sm">
                              {details?.arrival_destination?.name === null ||
                              loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                details?.arrival_destination?.name
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs  text-start text-gray-500">
                              Departure date
                            </span>
                            <span className="font-medium text-sm capitalize">
                              {details?.departure_date === null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                (() => {
                                  try {
                                    // Combine departure date and time into a Date object
                                    const departureDateTime = new Date(
                                      `${details.departure_date}T${details.departure_time}`
                                    );

                                    // Check if the date is valid
                                    if (isNaN(departureDateTime.getTime())) {
                                      return "Invalid date or time";
                                    }

                                    // Format the date and time as 'YYYY-MM-DD, hh:mm A'
                                    const formattedDeparture = format(
                                      departureDateTime,
                                      // "yyyy-MM-dd, hh:mm a"
                                      "yyyy-MM-dd"
                                    );

                                    return <>{formattedDeparture}</>;
                                  } catch (error) {
                                    return (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    );
                                  }
                                })()
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Return date
                            </span>
                            <span className="font-medium text-sm capitalize">
                              {details?.arrival_date === null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                (() => {
                                  try {
                                    // Combine departure date and time into a Date object
                                    const departureDateTime = new Date(
                                      `${details.arrival_date}T${details.arrival_time}`
                                    );

                                    // Check if the date is valid
                                    if (isNaN(departureDateTime.getTime())) {
                                      return "Invalid date or time";
                                    }

                                    // Format the date and time as 'YYYY-MM-DD, hh:mm A'
                                    const formattedDeparture = format(
                                      departureDateTime,
                                      // "yyyy-MM-dd, hh:mm a"
                                      "yyyy-MM-dd"
                                    );

                                    return <>{formattedDeparture}</>;
                                  } catch (error) {
                                    return (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    );
                                  }
                                })()
                              )}{" "}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <span className="font-normal text-xs  text-start text-gray-500">
                            Estimated duration
                          </span>
                          <span className="font-medium text-sm capitalize">
                            {details?.departure_time === null ||
                            details?.arrival_time === null ||
                            loading ? (
                              <Skeleton className="h-4 mt-2 w-32 bg-gray-200" />
                            ) : (
                              (() => {
                                try {
                                  // Validate and construct date-time strings
                                  const departureDateTime =
                                    details.departure_date &&
                                    details.departure_time
                                      ? new Date(
                                          `${details.departure_date}T${details.departure_time}`
                                        )
                                      : null;
                                  const arrivalDateTime =
                                    details.arrival_date && details.arrival_time
                                      ? new Date(
                                          `${details.arrival_date}T${details.arrival_time}`
                                        )
                                      : null;

                                  // Ensure valid dates
                                  if (
                                    !departureDateTime ||
                                    !arrivalDateTime ||
                                    isNaN(departureDateTime.getTime()) ||
                                    isNaN(arrivalDateTime.getTime())
                                  ) {
                                    return "Invalid date or time";
                                  }

                                  // Calculate the difference
                                  const duration = formatDistanceStrict(
                                    departureDateTime,
                                    arrivalDateTime
                                  );

                                  return <>{duration || details?.duration}</>;
                                } catch (error) {
                                  return (
                                    <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                  );
                                }
                              })()
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div className="gap-x-5 flex cursor-pointer items-center">
                                Trip Price <FaCaretDown />
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="start"
                              className="w-56 p-3"
                            >
                              <div className="flex flex-col gap-y-5">
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-normal text-xs  text-start text-gray-500">
                                    No. of Luggages
                                  </span>
                                  <span className="font-medium text-sm capitalize">
                                    {details?.trip_specification === null ||
                                    loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      Number(
                                        details?.trip_specification
                                          ?.luggage_size
                                      )
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-normal text-xs  text-start text-gray-500">
                                    Unit charge for extra luggage
                                  </span>
                                  <span className="font-medium text-sm capitalize">
                                    {details?.trip_specification === null ||
                                    loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      formatCurrency(
                                        details?.trip_specification
                                          ?.charge_for_extra_luggage
                                      )
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-normal text-xs  text-start text-gray-500">
                                    Total Price
                                  </span>
                                  <span className="font-medium text-sm capitalize">
                                    {details?.trip_specification === null ||
                                    loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      formatCurrency(
                                        details?.trip_specification?.price
                                      )
                                    )}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <div className="text-end">
                            <span className="font-medium text-sm text-start capitalize">
                              {details?.status === null || loading ? (
                                <Skeleton className="h-6 w-20 bg-gray-200" />
                              ) : (
                                <>
                                  {details?.status === "active" ? (
                                    <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                                      <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                      <span className="font-semibold text-xs">
                                        Active
                                      </span>
                                    </div>
                                  ) : details?.status === "completed" ? (
                                    <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#E6F4FF] text-[#1E90FF]">
                                      <span className="w-2 h-2 bg-[#1E90FF] rounded-full"></span>
                                      <span className="font-semibold text-xs">
                                        Completed
                                      </span>
                                    </div>
                                  ) : details?.status === "pending" ? (
                                    <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                                      <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                                      <span className="font-semibold text-xs">
                                        Pending
                                      </span>
                                    </div>
                                  ) : details?.status === "cancelled" ? (
                                    <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                                      <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                                      <span className="font-semibold text-xs">
                                        Cancelled
                                      </span>
                                    </div>
                                  ) : (
                                    ""
                                  )}
                                </>
                              )}
                            </span>
                          </div>
                        </div>
                        {/* Reason for cancelling */}
                        {details?.status === "cancelled" ? (
                          <div className="flex flex-col w-full">
                            <span className="font-normal text-xs  text-start text-gray-500">
                              Reason For Cancelling
                            </span>
                            <Separator className="my-3" />
                            <span className="font-medium text-sm">
                              {details?.reason_for_trip_cancellation ===
                              null ? (
                                <div className="w-full text-center italic text-gray-400">
                                  Nil
                                </div>
                              ) : loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                details?.reason_for_trip_cancellation
                              )}
                            </span>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-500">
                      Driver Info
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <div className="space-y-6">
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs  text-start text-gray-500">
                              Full name
                            </span>
                            <span className="font-medium text-sm capitalize">
                              {details?.vehicle?.driver?.first_name === null ||
                              loading ||
                              details?.vehicle?.driver?.first_name === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                <div className="flex items-center gap-x-2">
                                  <span>
                                    {details?.vehicle?.driver?.first_name}
                                  </span>
                                  <span>
                                    {details?.vehicle?.driver?.last_name}
                                  </span>
                                </div>
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs  text-start text-gray-500">
                              Email
                            </span>
                            <span className="font-medium text-sm">
                              {details?.vehicle?.driver?.email === null ||
                              loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                <div className="flex items-center gap-x-2">
                                  <span>{details?.vehicle?.driver?.email}</span>
                                </div>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="xl:w-[60%] h-full bg-white rounded-lg w-full p-5">
              <CardTitle className="text-lg text-gray-500">
                Route Tracking
              </CardTitle>
              <div className="grid xl:grid-cols-3 grid-cols-1 mt-3 gap-4 ">
                <div className="col-span-2 h-[500px]">
                  <MapComponent busStops={details?.bus_stop} />
                </div>
                <div>
                  <Timeline stops={details?.bus_stop} station={details} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 mt-5">
            <div className="flex gap-x-3 items-center ps-3 mb-5">
              <span className="font-bold">Active Passengers</span>
              <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
                {passengers?.length}
              </div>
            </div>
            <ScrollArea className="w-full">
              {loading ? (
                <>
                  <Table className=" min-w-[700px] py-2">
                    <TableHeader>
                      <TableRow className="text-xs lg:text-sm text-center">
                        <TableHead className="font-bold w-1/7 text-left">
                          Ticket ID
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-center">
                          Passengers
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-left">
                          Amount Paid
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-center">
                          Phone
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-center">
                          Date
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-center">
                          Ticket Status
                        </TableHead>
                        <TableHead className="font-bold w-1/7 text-center">
                          Tracking Id
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
                <ScrollArea>
                  {passengers?.length > 0 ? (
                    <Table className=" min-w-[900px] py-2">
                      <TableHeader>
                        <TableRow className="text-xs lg:text-sm text-center">
                          <TableHead className="font-bold w-1/7 text-left">
                            Ticket ID
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Passengers
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Amount Paid
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Phone
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Date
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Ticket Status
                          </TableHead>
                          <TableHead className="font-bold w-1/7 text-center">
                            Tracking Id
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* {sortedData!.map((data: any) => ( */}
                        {passengers?.map((data: any) => (
                          <TableRow
                            key={data?.id}
                            className="text-xs text-center lg:text-sm"
                          >
                            <TableCell className="w-1/7 py-5 text-left">
                              {data?.ticket_number}
                            </TableCell>
                            <TableCell className=" py-5 font-medium text-left w-1/7 me-4">
                              <div className="w-full flex gap-x-3 items-center">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={data?.profile_image} />
                                  <AvatarFallback>
                                    <IoPersonOutline />
                                  </AvatarFallback>
                                </Avatar>
                                <span className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                                  <span>{data?.name} </span>
                                  <small>{data?.email} </small>
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="w-1/7 py-5 text-center">
                              {formatCurrency(data?.amount)}
                            </TableCell>
                            <TableCell className="w-1/7 py-5 text-center">
                              {data?.phone_number}
                            </TableCell>

                            <TableCell className="w-1/7 py-5 text-center ">
                              {new Date(data?.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </TableCell>

                            <TableCell className=" py-5 w-1/7">
                              {data.status === "verified" ? (
                                <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                                  <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                                  <span className="font-semibold text-xs">
                                    Verified
                                  </span>
                                </div>
                              ) : data.status === "completed" ? (
                                <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#E6F4FF] text-[#1E90FF]">
                                  <span className="w-2 h-2 bg-[#1E90FF] rounded-full"></span>
                                  <span className="font-semibold text-xs">
                                    Completed
                                  </span>
                                </div>
                              ) : data.status === "paid" ? (
                                <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-auto bg-[#FFE6E6] text-[#B3261E]">
                                  <span className="w-2 h-2 bg-[#B3261E] rounded-full"></span>
                                  <span className="font-semibold text-xs">
                                    Not Validated
                                  </span>
                                </div>
                              ) : data.status === "cancelled" ? (
                                <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                                  <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                                  <span className="font-semibold text-xs">
                                    Cancelled
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
                                ""
                              )}
                            </TableCell>
                            <TableCell className="w-1/7 h-full py-5 flex mt-2 items-center justify-center text-center mx-auto gap-x-2">
                              <span>#</span> {data?.tracking_id}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex items-center w-full h-[400px] flex-col justify-center">
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
        </>
      )}
    </div>
  );
};

export default Slug;
