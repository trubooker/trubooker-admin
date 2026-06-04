import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Referral from "./Referral/Agents";
import Withdrawal from "./Withdrawal/Agents";
import { Skeleton } from "../ui/skeleton";
import CountUp from "react-countup";

const AgentInfo = ({
  withdrawal_req,
  agent_ref,
  referral,
  earning_overview,
  profile,
  loading,
  isFetching,
  params,
}: any) => {
  return (
    <div className="w-full">
      <div className="gap-4 flex xl:flex-row flex-col w-full">
        <div className="xl:w-[40%] w-full">
          <Card className="h-auto w-full mb-4">
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
                      <span className="font-medium text-sm capitalize">
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
                      <span className="font-medium text-sm capitalize">
                        {profile?.phone === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          profile?.phone
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between w-full">
                    <div className="flex flex-col w-[60%]">
                      <span className="font-normal text-xs text-gray-500">
                        Address
                      </span>
                      <span className="font-medium text-sm capitalize">
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
                      <span className="font-medium text-sm capitalize">
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
                      <span className="font-medium text-sm capitalize">
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
                      <span className="font-medium text-sm capitalize">
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
                      <span className="font-medium text-sm capitalize">
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

          <Card className="h-auto w-full">
            <CardHeader>
              <CardTitle className="text-lg text-gray-500">
                Earnings Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <div className="my-5 space-y-6">
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Total earnings
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-medium text-sm capitalize">
                        <CountUp end={profile?.total_earnings} prefix="₦ " />
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Payments processed
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-medium text-sm capitalize">
                        <CountUp
                          end={earning_overview?.payment_processed}
                          prefix="₦ "
                        />
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Pending payments
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-medium text-sm capitalize">
                        <CountUp
                          end={earning_overview?.pending_payment}
                          prefix="₦ "
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:w-[60%] w-full">
          <ScrollArea className="w-full mb-4 lg:col-span-2 col-span-1 text-lg text-gray-500">
            <div className="bg-white rounded-lg w-full p-5">
              <Referral
                data={referral}
                loading={loading}
                isFetching={isFetching}
                params={params}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
            <div className="bg-white rounded-lg w-full p-5">
              <div className="py-4">
                <h2 className="text-base font-bold">Withdrawal requests</h2>
              </div>
              <Withdrawal
                data={withdrawal_req}
                loading={loading}
                isFetching={isFetching}
              />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
