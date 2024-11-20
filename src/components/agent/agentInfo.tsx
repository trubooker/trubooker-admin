import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Referral from "./Referral/Agents";
import Withdrawal from "./Withdrawal/Agents";

const AgentInfo = () => {
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
                      <span className="font-medium text-sm">
                        +234 813234567
                      </span>
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
                      <span className="font-medium text-sm">₦10,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Payments processed
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-medium text-sm">₦5,000</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Pending payments
                      </span>
                    </div>
                    <div className="flex text-end flex-col">
                      <span className="font-medium text-sm">₦5,000</span>
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
              <div className="py-4 flex gap-x-3 items-center">
                <h2 className="text-base font-bold">Referral performance</h2>
                <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
                  {/* {DriverListData.length} */}7
                </div>
              </div>
              <Referral />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
          <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
            <div className="bg-white rounded-lg w-full p-5">
              <div className="py-4">
                <h2 className="text-base font-bold">Withdrawal requests</h2>
              </div>
              <Withdrawal />
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AgentInfo;
