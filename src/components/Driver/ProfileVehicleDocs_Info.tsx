import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DriversTable from "@/components/Driver/Driver";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { PassengerFeedback } from "@/constants";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { IoPersonOutline } from "react-icons/io5";

const ProfileVehicleDocs_Info = () => {
  return (
    <div className="w-full">
      <div className="gap-4 grid xl:grid-cols-3 grid-rows-1 w-full">
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
                    <span className="font-medium text-sm">Grace Femi</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Email address
                    </span>
                    <span className="font-medium text-sm">
                      gracefem@gmail.com
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Phone number
                    </span>
                    <span className="font-medium text-sm">+234 813234567</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Password
                    </span>
                    <span className="font-medium text-sm">***********</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Address
                    </span>
                    <span className="font-medium text-sm">
                      No 1, 123 london street, USA
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Date of birth
                    </span>
                    <span className="font-medium text-sm">10/10/2003</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      City
                    </span>
                    <span className="font-medium text-sm">Abuja</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Country
                    </span>
                    <span className="font-medium text-sm">Nigeria</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Gender
                    </span>
                    <span className="font-medium text-sm">Female</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Referral code
                    </span>
                    <span className="font-medium text-sm">zWrtAq</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="my-5 space-y-6">
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Vehicle Type
                    </span>
                    <span className="font-medium text-sm">Bus</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Vehicle Model
                    </span>
                    <span className="font-medium text-sm">Mercedes G63</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      License plate number
                    </span>
                    <span className="font-medium text-sm">JIG-454-DDF</span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Vehicle capacity
                    </span>
                    <span className="font-medium text-sm">8 Seats</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Vehicle photo
                    </span>
                    <span className="font-medium text-sm">
                      <span className="flex gap-x-2">
                        <Link href={""}>
                          <Image
                            src={"/photoGrid.svg"}
                            alt="Vehicle Photo"
                            width={35}
                            height={35}
                          />
                        </Link>
                        <div className="w-full flex flex-col gap-x-2 gap-y-1">
                          <div className="text-sm font-medium text-[#333F53]">
                            Vehicle photo1.png
                          </div>
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
                    </span>
                  </div>
                  <div className="flex text-end flex-col">
                    <span className="font-normal text-xs text-gray-500">
                      Vehicle colour
                    </span>
                    <span className="font-medium text-sm">Blue</span>
                  </div>
                </div>
                <div className="flex text-start flex-col">
                  <span className="font-normal text-xs text-gray-500">
                    Vehicle photo
                  </span>
                  <span className="font-medium text-sm">
                    <span className="flex gap-x-2">
                      <Link href={""}>
                        <Image
                          src={"/photoGrid.svg"}
                          alt="Vehicle Photo"
                          width={35}
                          height={35}
                        />
                      </Link>
                      <div className="w-full flex flex-col gap-x-2 gap-y-1">
                        <div className="text-sm font-medium text-[#333F53]">
                          Vehicle photo1.png
                        </div>
                        <div className=" text-[#344054] text-xs">10kb</div>
                      </div>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="my-5">
                <div className="grid grid-rows-1 xl:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-y-2">
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-y-2">
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-y-2">
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
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
                          <div className=" text-[#344054] text-xs">10kb</div>
                        </div>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
          <div className="bg-white rounded-lg w-full p-5">
            <div className="py-4">
              <h2 className="text-base font-bold">Trip history</h2>
            </div>
            <DriversTable />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Card className="w-full overflow-auto h-[500px]">
          <CardHeader className="lg-white text-left">
            <CardTitle className="text-lg text-gray-500">
              Passengers Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <>
              {PassengerFeedback?.map((actions: any) => (
                <div key={actions.id}>
                  <Separator />
                  <div className="my-6">
                    <div className="flex w-full items-start space-x-4">
                      <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                        <AvatarImage
                          src={
                            "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load"
                          }
                        />
                        <AvatarFallback>
                          <IoPersonOutline className="w-14 h-14" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="">
                        <p className="text-gray-800 font-bold text-sm">
                          {actions.name}
                        </p>
                        <p className="text-xs text-gray-500">{actions.email}</p>
                        <span className="flex items-center gap-x-3">
                          {actions.rating}.0{" "}
                          <StarRatings
                            rating={actions.rating}
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
                    <div className="text-sm mt-3">{actions.message}</div>
                  </div>
                </div>
              ))}
            </>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileVehicleDocs_Info;
