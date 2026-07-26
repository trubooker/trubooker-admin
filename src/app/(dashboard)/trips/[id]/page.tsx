"use client";

import Goback from "@/components/Goback";
import { useGetSingleTripQuery } from "@/redux/services/Slices/tripsApiSlice";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
import MapComponent from "@/components/Driver/Trip/GoogleMaps";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { FaCaretDown } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Timeline from "@/components/Driver/Trip/Timeline";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { IoPersonOutline } from "react-icons/io5";

const SingleTrip = () => {
  const params = useParams();
  const id = params.id;
  const {
    data,
    isLoading: loading,
    isFetching,
  } = useGetSingleTripQuery({
    trip: id,
  });
  const details = data?.result; // trip object
  const deets = details?.vehicle;

  // First stop in the arrival destinations array (API returns an array)
  const arrival = details?.arrivalDestination?.[0];
  // Trip specification is an array too — take the first entry
  const spec = details?.tripSpecification?.[0];

  // Driver rating summary (only rating data the endpoint returns)
  const driver = details?.driver;
  const avgRating = Number(driver?.averageRating ?? 0);
  const ratingCount = Number(driver?.ratingCount ?? 0);

  console.log("details", details);

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
            formerPage={`Trips`}
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
                              {details?.departureLocation == null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                details?.departureLocation
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Destination
                            </span>
                            <span className="font-medium text-sm">
                              {arrival == null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                arrival?.address
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
                              {details?.departureTime == null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                (() => {
                                  try {
                                    // Combine departure DATE and departure TIME
                                    const departureDateTime = new Date(
                                      `${details.departureDate}T${details.departureTime}`
                                    );

                                    if (isNaN(departureDateTime.getTime())) {
                                      return "Invalid date or time";
                                    }

                                    const formattedDeparture = format(
                                      departureDateTime,
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
                              {details?.arrivalTime == null || loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                (() => {
                                  try {
                                    // Combine arrival DATE and arrival TIME
                                    const arrivalDateTime = new Date(
                                      `${details.arrivalDate}T${details.arrivalTime}`
                                    );

                                    if (isNaN(arrivalDateTime.getTime())) {
                                      return "Invalid date or time";
                                    }

                                    const formattedArrival = format(
                                      arrivalDateTime,
                                      "yyyy-MM-dd"
                                    );

                                    return <>{formattedArrival}</>;
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
                            {details?.departureTime == null || loading ? (
                              <Skeleton className="h-4 mt-2 w-32 bg-gray-200" />
                            ) : (
                              (() => {
                                try {
                                  const departureDateTime =
                                    details.departureDate && details.departureTime
                                      ? new Date(
                                          `${details.departureDate}T${details.departureTime}`
                                        )
                                      : null;
                                  const arrivalDateTime =
                                    details.arrivalDate && details.arrivalTime
                                      ? new Date(
                                          `${details.arrivalDate}T${details.arrivalTime}`
                                        )
                                      : null;

                                  if (
                                    !departureDateTime ||
                                    !arrivalDateTime ||
                                    isNaN(departureDateTime.getTime()) ||
                                    isNaN(arrivalDateTime.getTime())
                                  ) {
                                    return details?.duration || "N/A";
                                  }

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
                                    {spec == null || loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      // NOTE: verify the nested key by expanding
                                      // tripSpecification[0] in the console.
                                      Number(spec?.luggage_size ?? 0)
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-normal text-xs  text-start text-gray-500">
                                    Unit charge for extra luggage
                                  </span>
                                  <span className="font-medium text-sm capitalize">
                                    {spec == null || loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      formatCurrency(
                                        spec?.charge_for_extra_luggage
                                      )
                                    )}
                                  </span>
                                </div>
                                <div className="flex flex-col gap-y-2">
                                  <span className="font-normal text-xs  text-start text-gray-500">
                                    Total Price
                                  </span>
                                  <span className="font-medium text-sm capitalize">
                                    {details?.price == null || loading ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      // Top-level `price` is confirmed on the trip object
                                      formatCurrency(details?.price)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>

                          <div className="text-end">
                            <span className="font-medium text-sm text-start capitalize">
                              {details?.status == null || loading ? (
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
                                  ) : details?.status === "pending" ||
                                    details?.status === "upcoming" ? (
                                    <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                                      <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                                      <span className="font-semibold text-xs capitalize">
                                        {details?.status}
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
                              {details?.reasonForTripCancellation == null ? (
                                <div className="w-full text-center italic text-gray-400">
                                  Nil
                                </div>
                              ) : loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                details?.reasonForTripCancellation
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
                              {details?.driver?.user?.firstName == null ||
                              loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                <div className="flex items-center gap-x-2">
                                  <span>{details?.driver?.user?.firstName}</span>
                                  <span>{details?.driver?.user?.lastName}</span>
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
                              {details?.driver?.user?.email == null ||
                              loading ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                <div className="flex items-center gap-x-2">
                                  <span>{details?.driver?.user?.email}</span>
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
              <div>
                <Card className="h-auto">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-500">
                      Vehicle Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value={`item-1`} className="">
                          <AccordionTrigger className="my-3">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow className="text-xs lg:text-sm">
                                  <TableHead className="font-bold w-1/2 text-left">
                                    <div className="flex flex-col">
                                      <span className="font-normal text-xs text-gray-500">
                                        Vehicle Type
                                      </span>
                                      <span className="font-medium text-sm">
                                        {/* NOTE: expand `vehicle` in console to
                                            confirm these nested keys. */}
                                        {deets?.type == null ? (
                                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                        ) : (
                                          deets?.type
                                        )}
                                      </span>
                                    </div>
                                  </TableHead>

                                  <TableHead className="font-bold w-1/2 text-left">
                                    <div className="flex text-end flex-col">
                                      <span className="font-normal text-xs text-gray-500">
                                        Vehicle Model
                                      </span>
                                      <span className="font-medium text-sm">
                                        {deets?.model == null ? (
                                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                        ) : (
                                          deets?.model
                                        )}
                                      </span>
                                    </div>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                            </Table>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="my-5 space-y-6">
                              <div className="flex justify-between">
                                <div className="flex flex-col">
                                  <span className="font-normal text-xs text-gray-500">
                                    License plate number
                                  </span>
                                  <span className="font-medium text-sm">
                                    {deets?.plateNumber == null ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      deets?.plateNumber
                                    )}
                                  </span>
                                </div>
                                <div className="flex text-end flex-col">
                                  <span className="font-normal text-xs text-gray-500">
                                    Vehicle capacity
                                  </span>
                                  <span className="font-medium text-sm">
                                    {deets?.capacity == null ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      deets?.capacity
                                    )}{" "}
                                    Seats
                                  </span>
                                </div>
                              </div>
                              <div className="flex justify-between">
                                <div className="flex flex-col">
                                  <span className="font-normal text-xs text-gray-500">
                                    Vehicle colour
                                  </span>
                                  <span className="font-medium text-sm">
                                    {deets?.color == null ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      deets?.color
                                    )}
                                  </span>
                                </div>
                                <div className="flex text-end flex-col">
                                  <span className="font-normal text-xs text-gray-500">
                                    Insurance
                                  </span>
                                  <span className="font-medium text-sm">
                                    {deets?.insurance == null ? (
                                      <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                    ) : (
                                      deets?.insurance
                                    )}
                                  </span>
                                </div>
                              </div>

                              <Tabs
                                defaultValue="vehiclePhotos"
                                className="w-full"
                              >
                                <TabsList className="grid w-full grid-cols-2">
                                  <TabsTrigger value="vehiclePhotos">
                                    Photos
                                  </TabsTrigger>
                                  <TabsTrigger value="features">
                                    Features
                                  </TabsTrigger>
                                </TabsList>
                                <TabsContent value="vehiclePhotos">
                                  <div className="w-full grid grid-cols-1 pt-5 gap-4">
                                    {deets?.vehiclePhoto?.map(
                                      (i: any, index: number) => (
                                        <div key={index}>
                                          <Link href={i} target="_blank">
                                            <span className="font-medium text-sm">
                                              <span className="flex gap-x-2 items-center">
                                                <Image
                                                  src={"/photoGrid.svg"}
                                                  alt="Vehicle Photo"
                                                  width={35}
                                                  height={35}
                                                />

                                                <div className="text-sm font-medium text-[#333F53]">
                                                  Vehicle photo {index + 1}.png
                                                </div>
                                              </span>
                                            </span>
                                          </Link>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </TabsContent>
                                <TabsContent value="features">
                                  <div className="w-full grid grid-cols-1 pt-5 mt-5 gap-8">
                                    {/* Features live at trip level as `vehicleFeatures` */}
                                    {details?.vehicleFeatures?.length > 1 ? (
                                      <div>
                                        <span className="font-medium text-sm">
                                          <span className="flex gap-x-2 items-center">
                                            <div className="text-sm font-medium text-[#333F53]">
                                              {details.vehicleFeatures.join(
                                                ", "
                                              )}
                                            </div>
                                          </span>
                                        </span>
                                      </div>
                                    ) : (
                                      details?.vehicleFeatures?.map(
                                        (i: any, index: number) => (
                                          <div key={index}>
                                            <span className="font-medium text-sm">
                                              <span className="flex gap-x-2 items-center">
                                                <div className="text-sm font-medium text-[#333F53]">
                                                  {i}
                                                </div>
                                              </span>
                                            </span>
                                          </div>
                                        )
                                      )
                                    )}
                                  </div>
                                </TabsContent>
                              </Tabs>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="xl:w-[60%] w-full h-full space-y-4">
              {" "}
              <div className=" bg-white rounded-lg w-full p-5">
                <CardTitle className="text-lg text-gray-500">
                  Route Tracking
                </CardTitle>
                <div className="grid xl:grid-cols-3 grid-cols-1 mt-3 gap-4 ">
                  <div className="col-span-2 h-[500px]">
                    <MapComponent
                      busstop_latlong={details?.busstopLatlong}
                      departure={details?.departureLatlong}
                      arrival={details?.arrivalDestination}
                    />
                  </div>
                  <div>
                    <Timeline stops={details?.busStop} station={details} />
                  </div>
                </div>
              </div>
              {/* Driver rating summary — the endpoint returns no review list,
                  only driver.averageRating and driver.ratingCount */}
              <Card className="w-full overflow-auto h-[500px]">
                <CardHeader className="lg-white text-left">
                  <CardTitle className="text-lg text-gray-500">
                    Users Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {ratingCount > 0 ? (
                    <div className="flex w-full items-center gap-x-4 mt-4">
                      <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                        <AvatarImage
                          src={details?.driver?.user?.profileImage}
                        />
                        <AvatarFallback>
                          <IoPersonOutline className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col gap-y-1">
                        <p className="text-gray-800 font-bold text-sm capitalize">
                          {details?.driver?.user?.firstName}{" "}
                          {details?.driver?.user?.lastName}
                        </p>
                        <span className="flex items-center gap-x-3">
                          {avgRating.toFixed(1)}{" "}
                          <StarRatings
                            rating={avgRating}
                            numberOfStars={5}
                            name="rating"
                            starRatedColor="#F5A623"
                            starDimension="20px"
                            starSpacing="3px"
                            starEmptyColor="grey"
                          />
                        </span>
                        <span className="text-xs text-gray-500">
                          Based on {ratingCount} review
                          {ratingCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
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
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleTrip;