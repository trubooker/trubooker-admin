"use client";

import React, { useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { ReferralProgramListData } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
// import CountUp from "react-countup";
import { IoPersonOutline } from "react-icons/io5";
import Pagination from "@/components/Pagination";
// import Notifications from "@/components/Notification";
import { useRouter } from "next/navigation";
import ReferralProgram from "@/components/Settings/ReferralProgram";
import PriceControl from "@/components/Settings/serviceFare";
import { useGetReferralProgramsQuery } from "@/redux/services/Slices/settings/referralProgramApiSlice";
import Image from "next/image";

const Referral_program = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const {
    data: info,
    isLoading: loading,
    isFetching,
  } = useGetReferralProgramsQuery(null);

  const totalPages = info?.data?.active_trips?.last_page;
  const revenue = info?.data;
  const ReferralProgramListData = info?.data?.referral_performance?.data;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  return (
    <div>
      <div className="flex flex-col h-full w-full gap-4">
        <div className="flex gap-x-3 items-center ps-3 mb-5">
          <h2 className="text-2xl font-bold">Referral Program</h2>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 w-full gap-4">

          <div className="flex flex-col gap-y-10 lg:col-span-2 w-full ">
            <div className="w-full">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          revenue?.performance_count
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Performance Count
                    </span>
                  </CardContent>
                </Card>

                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary-orange]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          revenue?.total_active_referrals
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Active Referrals
                    </span>
                  </CardContent>
                </Card>

                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          revenue?.total_coupon_issued
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Coupons Issued
                    </span>
                  </CardContent>
                </Card>

                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary-orange]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          revenue?.total_coupon_redeemed
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Coupons Redeemed
                    </span>
                  </CardContent>
                </Card>

                <Card
                  className={`w-full h-32 border-none my-auto  bg-[--primary]`}
                >
                  <CardContent className="text-2xl font-semibold h-full flex flex-col my-auto justify-center gap-y-2">
                    <div className="flex gap-x-3 text-white items-center">
                      <span className="flex gap-x-2 items-center">
                        {loading ? (
                          <Skeleton className="h-8 w-[50px] bg-gray-200" />
                        ) : (
                          revenue?.total_expired_coupons
                        )}
                      </span>
                    </div>
                    <span className="text-sm text-white font-normal">
                      Total Expired Coupon
                    </span>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-white rounded-xl w-full p-5">
              <div className="flex gap-x-3 items-center ps-3 mb-5">
                <h2 className="text-lg font-bold">Referral Program</h2>
                <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
                  {ReferralProgramListData?.length}
                </div>
              </div>
              {ReferralProgramListData?.length > 0 ? (
                <ScrollArea className="w-full">
                  {loading ? (
                    <>
                      <Table className="min-w-[700px] py-2">
                        <TableHeader>
                          <TableRow className="text-xs lg:text-sm text-center">
                            <TableHead className="font-bold w-1/4 text-left">
                              Passenger name
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
                    <ScrollArea>
                      <Table className="min-w-[700px] py-2">
                        <TableHeader>
                          <TableRow className="text-xs lg:text-sm text-center">
                            <TableHead className="font-bold w-1/4 text-left">
                              Passenger name
                            </TableHead>
                            <TableHead className="font-bold w-1/4 text-center">
                              Referrals made
                            </TableHead>
                            <TableHead className="font-bold w-1/4 text-center">
                              Target Referrals
                            </TableHead>
                            <TableHead className="w-1/4 font-bold text-center">
                              Coupon issued
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ReferralProgramListData?.map((data: any) => (
                            <TableRow
                              key={data.id}
                              className="text-xs text-center lg:text-sm"
                            >
                              <TableCell className=" py-5 w-1/4 text-left">
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
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className=" py-5 w-1/4">
                                {data.referrals}
                              </TableCell>
                              <TableCell className="py-5 w-1/4">
                                {data?.target_referrals}
                              </TableCell>
                              <TableCell className=" py-5 text-center w-1/4">
                                {data?.coupon}
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
              ) : (
                <div className="flex flex-col items-center justify-center h-[330px]">
                  <Image
                    src="/nodata.svg"
                    alt="No Data"
                    width={160}
                    height={160}
                  />
                  <h1 className="mt-8 text-lg font-semibold text-center">
                    You are all caught up
                  </h1>
                </div>
              )}
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

          <div className="w-full flex flex-col gap-y-5">
            <ReferralProgram />
            <PriceControl />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Referral_program;
