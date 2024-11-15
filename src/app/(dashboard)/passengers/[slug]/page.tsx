"use client";

import Goback from "@/components/Goback";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import PassengerTripTable from "@/components/Passenger/PassengerTrip";

const ViewPassenger = () => {
  const params = useParams();
  const id = String(params.slug);
  const router = useRouter();
  const status = "active";
  return (
    <div>
      <Goback formerPage={"Passenger"} presentPage={`Passenger id ${id}`} />
      <div className="bg-white p-5 rounded-lg mt-5 flex items-center justify-between lg:flex-row flex-col gap-y-10">
        <div className="w-full flex gap-x-3 items-center">
          <Avatar className="lg:w-32 h-28 lg:h-32 w-28">
            <AvatarImage src={""} />
            <AvatarFallback>
              <IoPersonOutline className="w-14 h-14" />
            </AvatarFallback>
          </Avatar>
          <div className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
            <div className="flex items-center gap-x-5">
              <span className="text-xl font-extrabold">Grace Femi</span>
              <>
                {status === "active" ? (
                  <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                    <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                    <span className="font-semibold text-xs">Active</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[--primary-orange]">
                    e{" "}
                    <span className="w-2 h-2 bg-[--primary-orange] rounded-full"></span>
                    <span className="font-semibold text-xs">Suspended</span>
                  </div>
                )}
              </>
            </div>
            <div className="lg:mt-3 mt-1 flex flex-col">
              <span className="font-extrabold text-sm">Passenger</span>
              <span className="text-gray-400 text-xs">#{id}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse lg:flex-col gap-y-2 w-full lg:w-auto">
          <Button
            variant={"outline"}
            className="bg-[--danger] hover:bg-[--danger-btn] hover:text-white lg:w-[300px] h-10 lg:h-14 text-white"
          >
            Deactivate account
          </Button>
          <span className="text-left lg:text-right lg:me-5 text-sm">
            Joined 10 Aug, 2020
          </span>
        </div>
      </div>
      <PassengerTripTable />
    </div>
  );
};

export default ViewPassenger;
