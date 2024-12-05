"use client";

import React, { FC, useState } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import MapComponent from "@/components/Driver/Trip/GoogleMaps";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import Image from "next/image";

const Slug = ({ nok, profile }: any) => {
  const stops = [
    {
      name: "Abuja Bus Terminal",
      time: "10:00am",
      longitude: 7.49508,
      latitude: 9.07226,
    },
    {
      name: "Ejuleigba",
      time: "10:15am",
      longitude: 7.64526,
      latitude: 9.15411,
    },
    {
      name: "Jiwon Park",
      time: "11:00am",
      longitude: 7.73594,
      latitude: 8.93754,
    },
    {
      name: "Ogaminana",
      time: "12:10pm",
      longitude: 7.81323,
      latitude: 8.84345,
    },
  ];

  const info: any = {};
  const [page, setPage] = useState(1);
  const totalPages = info?.data?.active_trips?.last_page;
  const userData: any = [];
  const loading: boolean = false;
  const isFetching: boolean = false;
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
                  Trip details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="my-5 space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Departure
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.first_name || profile?.last_name ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            <div className="flex gap-x-2">
                              <span> {profile?.first_name}</span>
                              <span> {profile?.last_name}</span>
                            </div>
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Destination
                        </span>
                        <span className="font-medium text-sm">
                          {!profile?.email ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.email
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Departure date
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.address ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.address
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Return date
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.dob ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            new Date(profile?.dob).toLocaleDateString("en-US", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          )}{" "}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Trip ID
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.city ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.city
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Trip Price
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.country ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.country
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Estimated duration
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.gender ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.gender
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Status
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!profile?.referral ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            profile?.referral
                          )}
                        </span>
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
                  Driver Info
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
                        <span className="font-medium text-sm capitalize">
                          {!nok?.phone_number ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.phone_number
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Vehicle plate number
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!nok?.relationship ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.relationship
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Vehicle capacity
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!nok?.phone_number ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.phone_number
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Relationship
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {!nok?.relationship ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.relationship
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
          <div className="grid xl:grid-cols-3 grid-cols-1 gap-4 ">
            <div className="col-span-2 h-[500px]">
              <MapComponent busStops={stops} />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-bold mb-4">Bus Stops</h3>
              <div className="space-y-4">
                {stops.map((stop: any, index: number) => (
                  <div key={index} className="flex flex-col items-start">
                    <div className="w-8 text-sm font-semibold">{stop.time}</div>
                    <div className="">
                      <div className="text-sm font-medium">{stop.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 mt-5">
        <div className="flex gap-x-3 items-center ps-3 mb-5">
          <span className="font-bold">Active Passengers</span>
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
                      Ticket ID
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Amount Paid
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Date
                    </TableHead>
                    <TableHead className="font-bold w-1/4 text-center">
                      Ticket Status
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
              {userData?.length > 0 ? (
                <Table className=" min-w-[700px] py-2">
                  <TableHeader>
                    <TableRow className="text-xs lg:text-sm text-center">
                      <TableHead className="font-bold w-1/4 text-left">
                        Drivers
                      </TableHead>
                      <TableHead className="font-bold w-1/4 text-center">
                        <span className="flex gap-x-3 items-center cursor-pointer justify-left">
                          Departure
                        </span>
                      </TableHead>
                      <TableHead className="font-bold w-1/4 text-center">
                        <span className="flex gap-x-3 items-center cursor-pointer justify-left">
                          Arrival
                        </span>
                      </TableHead>
                      <TableHead className="font-bold w-1/4 text-center">
                        Status
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
                              <span>{data.driver} </span>
                              {/* <span>{data.last_name}</span> */}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="w-1/7 py-5 text-left">
                          <div className="flex flex-col">
                            <span> {data.departure_location || "Kogi"}</span>
                            <small className="mt-1 font-light flex gap-x-2">
                              <span className="font-normal">Date:</span>{" "}
                              {data.departure_date || "2022-01-01"}
                            </small>
                          </div>
                        </TableCell>

                        <TableCell className="w-1/7 py-5 text-left ">
                          <div className="flex flex-col">
                            <span>
                              {" "}
                              {data.arrival_location || "Benin City"}
                            </span>
                            <small className="mt-1 font-light flex gap-x-2">
                              <span className="font-normal">Date:</span>{" "}
                              {data.arrival_date}, {data?.arrival_time}
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
    </div>
  );
};

export default Slug;
