"use client";

import Goback from "@/components/Goback";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import ProfileVehicleDocs_Info from "@/components/Driver/ProfileVehicleDocs_Info";
import { FaMoneyBillWave } from "react-icons/fa";
import { useGetOneDriverQuery } from "@/redux/services/Slices/driverApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ViewDriver = () => {
  const params = useParams();
  const id = String(params.slug);
  const router = useRouter();
  const status = "active";
  const {
    isLoading: loading,
    data: userData,
    isFetching,
  } = useGetOneDriverQuery(id);
  console.log("SingleDriver", userData);
  const profile = userData?.data?.profile; //object
  const vehicle = userData?.data?.vehicles; //array
  const feedback = userData?.data?.reviews; //array
  const th = userData?.data?.trip_history; //array

  return (
    <>
      {!isFetching || !loading ? (
        <div>
          <Goback
            formerPage={"Drivers"}
            presentPage={`${profile?.first_name} ${profile?.last_name}`}
          />
          <div className="bg-white p-5 rounded-lg my-5 flex items-center justify-between lg:flex-row flex-col gap-y-10">
            <div className="w-full flex gap-x-3 items-center">
              <Avatar className="lg:w-32 h-28 lg:h-32 w-28">
                <AvatarImage src={profile?.profile_image} />
                <AvatarFallback>
                  <IoPersonOutline className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                <div className="flex items-center gap-x-5">
                  <span className="text-xl font-extrabold">
                    {profile?.first_name} {profile?.last_name}
                  </span>
                  {/* <>
                    {profile?.status === "active" ? (
                      <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                        <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                        <span className="font-semibold text-xs">
                          {profile?.status}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[--primary-orange]">
                        <span className="w-2 h-2 bg-[--primary-orange] rounded-full"></span>
                        <span className="font-semibold text-xs">
                          {profile?.status}
                        </span>
                      </div>
                    )}
                  </> */}
                </div>
                <div className="lg:mt-3 mt-1 flex flex-col">
                  <span className="font-extrabold text-sm capitalize">
                    {profile?.role || profile?.type}
                  </span>
                  <span className="text-gray-400 text-xs">
                    #{profile?.referral}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-col gap-y-2 w-full lg:w-auto ">
              <div className="mb-5 hidden lg:flex justify-end gap-x-3 items-center text-2xl text-green-500 font-medium w-full text-end">
                <FaMoneyBillWave /> NGN{" "}
                {profile.current_balance === null
                  ? "0.00"
                  : profile.current_balance}
              </div>
              <Button
                variant={"outline"}
                className="bg-[--danger] hover:bg-[--danger-btn] hover:text-white lg:w-[300px] h-10 lg:h-14 text-white"
              >
                Deactivate account
              </Button>
              <span className="text-left lg:text-right lg:me-5 text-sm">
                Joined{" "}
                {new Date(profile?.created_at).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="lg:hidden flex gap-x-5 items-center text-2xl text-green-500 font-medium">
              <FaMoneyBillWave /> NGN{" "}
              {profile.current_balance === null
                ? "0.00"
                : profile.current_balance}
            </div>
          </div>
          <ProfileVehicleDocs_Info
            th={th}
            feedback={feedback}
            vehicle={vehicle}
            profile={profile}
            loading={loading}
            isFetching={isFetching}
          />
        </div>
      ) : (
        <div>
          <Skeleton className="h-8 bg-gray-200 w-[250px]" />
          <Skeleton className=" bg-gray-200 p-5 rounded-lg my-5 h-32 flex items-center justify-between lg:flex-row flex-col gap-y-10" />

          <div className="w-full grid lg:grid-cols-3 grid-cols-1 pt-5  mt-5 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div className="w-full rounded-md" key={i}>
                <div className="flex flex-col space-y-3">
                  <Skeleton className="bg-gray-200 h-[125px] w-full rounded-xl" />
                </div>
              </div>
            ))}
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
      )}
    </>
  );
};

export default ViewDriver;
