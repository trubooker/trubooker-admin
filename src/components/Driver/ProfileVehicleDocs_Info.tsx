import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriversTable from "@/components/Driver/Driver";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { IoPersonOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";

const ProfileVehicleDocs_Info = ({
  th,
  feedback,
  vehicle,
  profile,
  loading,
  isFetching,
}: any) => {
  return (
    <div className="w-full">
      <div className="gap-4 grid xl:grid-cols-3 grid-rows-1 w-full">
        {/* profile  */}
        <Card className="h-auto w-full">
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
                    <span className="font-medium text-sm">
                      {profile?.first_name === null ||
                      profile?.last_name === null ? (
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
                      Email address
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.email === null ? (
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
                      Phone number
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.phone === null ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        profile?.phone
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Address
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.address === null ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        profile?.address
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Date of birth
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.dob === null ? (
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
                      City
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.city === null ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        profile?.city
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Country
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.country === null ? (
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
                      Gender
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.gender === null ? (
                        <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                      ) : (
                        profile?.gender
                      )}
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Referral code
                    </span>
                    <span className="font-medium text-sm">
                      {profile?.referral === null ? (
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

        {/* vehicle info */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {vehicle?.map((deets: any, index: number) => (
                <Accordion
                  key={deets.id}
                  type="single"
                  collapsible
                  // defaultValue="item-1"
                  className="w-full"
                >
                  <AccordionItem value={`item-${index + 1}`} className="">
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
                                  {deets?.vehicle_type?.name === null ? (
                                    <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                  ) : (
                                    deets?.vehicle_type?.name
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
                                  {deets?.model === null ? (
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
                              {deets?.license_plate_number === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.license_plate_number
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Vehicle capacity
                            </span>
                            <span className="font-medium text-sm">
                              {deets?.capacity === null ? (
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
                              {deets?.color === null ? (
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
                              {deets?.insurance === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.insurance
                              )}
                            </span>
                          </div>
                        </div>

                        <Tabs defaultValue="vehiclePhotos" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="vehiclePhotos">
                              Photos
                            </TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                          </TabsList>
                          <TabsContent value="vehiclePhotos">
                            <div className="w-full grid grid-cols-1 pt-5 gap-4">
                              {deets?.photos?.map((i: any, index: number) => (
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
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="features">
                            <div className="w-full grid grid-cols-1 pt-5 mt-5 gap-8">
                              {deets?.features?.length > 1 ? (
                                <div>
                                  <span className="font-medium text-sm">
                                    <span className="flex gap-x-2 items-center">
                                      <div className="text-sm font-medium text-[#333F53]">
                                        {deets.features.join(", ")}
                                      </div>
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                deets?.features?.map(
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
              ))}
            </div>

            {/* <div>
              {vehicle?.map((deets: any) => (
                <div key={deets.id} className="my-5 space-y-6">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Vehicle Type
                      </span>
                      <span className="font-medium text-sm">
                        {deets?.vehicle_type?.name === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          deets?.vehicle_type?.name
                        )}
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Vehicle Model
                      </span>
                      <span className="font-medium text-sm">
                        {deets?.model === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          deets?.model
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        License plate number
                      </span>
                      <span className="font-medium text-sm">
                        {deets?.license_plate_number === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          deets?.license_plate_number
                        )}
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Vehicle capacity
                      </span>
                      <span className="font-medium text-sm">
                        {deets?.capacity === null ? (
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
                        {deets?.color === null ? (
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
                        {deets?.insurance === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          deets?.insurance
                        )}
                      </span>
                    </div>
                  </div>

                  <Tabs defaultValue="vehiclePhotos" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="vehiclePhotos">Photos</TabsTrigger>
                      <TabsTrigger value="features">Features</TabsTrigger>
                    </TabsList>
                    <TabsContent value="vehiclePhotos">
                      <div className="w-full grid grid-cols-1 pt-5 gap-4">
                        {deets?.photos?.map((i: any, index: number) => (
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
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="features">
                      <div className="w-full grid grid-cols-1 pt-5 mt-5 gap-8">
                        {deets?.features?.length > 1 ? (
                          <div>
                            <span className="font-medium text-sm">
                              <span className="flex gap-x-2 items-center">
                                <div className="text-sm font-medium text-[#333F53]">
                                  {deets.features.join(", ")}
                                </div>
                              </span>
                            </span>
                          </div>
                        ) : (
                          deets?.features?.map((i: any, index: number) => (
                            <div key={index}>
                              <span className="font-medium text-sm">
                                <span className="flex gap-x-2 items-center">
                                  <div className="text-sm font-medium text-[#333F53]">
                                    {i}
                                  </div>
                                </span>
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ))}
            </div> */}
          </CardContent>
        </Card>

        {/* vehicle docs */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {vehicle?.reg_docs?.length > 0 ? (
                <div className="my-5">
                  <div className="grid grid-rows-1 xl:grid-cols-2 gap-8">
                    {vehicle?.reg_docs.map((docs: any, index: number) => (
                      <div key={index} className="flex flex-col gap-y-2">
                        <span className="font-normal text-xs text-gray-500">
                          Vehicle photo
                        </span>

                        <span className="font-medium text-sm">
                          <span className="flex gap-x-2">
                            <Link href={""}>
                              <Image
                                src={"/photoGrid.svg"}
                                alt="Vehicle Photo"
                                width={30}
                                height={30}
                              />
                            </Link>
                            <div className="w-full flex flex-col gap-x-2 gap-y-1">
                              <div className="text-[12px] font-medium text-[#333F53]">
                                Vehicle.png
                              </div>
                              <div className=" text-[#344054] text-xs">
                                10kb
                              </div>
                            </div>
                          </span>
                        </span>
                      </div>
                    ))}
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
            </div>
          </CardContent>
        </Card>

        {/* trip history */}
        <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
          <div className="bg-white rounded-lg w-full p-5">
            <div className="py-4">
              <h2 className="text-base font-bold">Trip history</h2>
            </div>
            <DriversTable data={th} loading={loading} isFetching={isFetching} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* feedback  */}
        <Card className="w-full overflow-auto h-[500px]">
          <CardHeader className="lg-white text-left">
            <CardTitle className="text-lg text-gray-500">
              Passengers Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedback?.length > 0 ? (
              <>
                {feedback?.map((actions: any) => (
                  <div key={actions.id}>
                    <Separator />
                    <div className="my-6">
                      <div className="flex w-full items-start space-x-4">
                        <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                          <AvatarImage src={actions?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="">
                          <p className="text-gray-800 font-bold text-sm">
                            {actions?.passenger}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            {actions.email}
                          </p> */}
                          <span className="flex items-center gap-x-3">
                            {actions?.rating}.0{" "}
                            <StarRatings
                              rating={actions?.rating}
                              numberOfStars={5}
                              name="rating"
                              starRatedColor="#F5A623"
                              starDimension="20px"
                              starSpacing="3px"
                              starEmptyColor="grey"
                            />
                          </span>
                        </div>
                      </div>
                      <div className="text-sm mt-3">{actions?.comment}</div>
                    </div>
                  </div>
                ))}
              </>
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
  );
};

export default ProfileVehicleDocs_Info;
