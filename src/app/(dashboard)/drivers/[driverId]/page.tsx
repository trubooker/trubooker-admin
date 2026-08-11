"use client";

import Goback from "@/components/Goback";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import ProfileVehicleDocs_Info from "@/components/Driver/ProfileVehicleDocs_Info";
import { FaMoneyBillWave } from "react-icons/fa";
import {
  useGetOneDriverQuery,
  useToggleDriverStatusMutation,
} from "@/redux/services/Slices/driverApiSlice";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Modal } from "@/components/DualModal";
import ToggleStatus from "@/components/ToggleStatus";
import { formatCurrency } from "@/lib/utils";

const ViewDriver = () => {
  const params = useParams();
  const id = String(params.driverId);
  const router = useRouter();
  
  console.log("🆔 Driver ID from params:", id);
  
  const {
    isLoading: loading,
    data: userData,
    isFetching,
    error,
  } = useGetOneDriverQuery(id);

  console.log("📦 Full userData:", userData);
  
  const [mutate, { isLoading: loadingToggle }] =
    useToggleDriverStatusMutation();

  const toggleDriverStatus = async () => {
    console.log("🔄 Toggling driver status for ID:", id);
    try {
      await mutate(id).unwrap();
      console.log("✅ Driver status toggled successfully");
    } catch (error) {
      console.error("❌ Failed to toggle status:", error);
    }
  };

  // ===== COMPREHENSIVE DATA EXTRACTION =====
  // Try different possible data structures
  const dataSource = userData?.data || userData?.result || userData || {};
  
  console.log("🔍 Data source for extraction:", dataSource);
  console.log("🔍 Data source keys:", Object.keys(dataSource));

  // Extract profile - try multiple possible paths
  const profile = userData?.result?.user || 
                  userData?.data?.profile || 
                  userData?.profile || 
                  userData?.user || 
                  {};

  console.log("👤 Profile extracted:", profile);
  console.log("👤 Profile keys:", Object.keys(profile));

  // Extract vehicles - try multiple possible paths
  let vehicle: any[] = [];
  
  // Try path 1: userData.result.vehicle
  if (userData?.result?.vehicle) {
    vehicle = Array.isArray(userData.result.vehicle) 
      ? userData.result.vehicle 
      : [userData.result.vehicle];
  }
  // Try path 2: userData.data.vehicles
  else if (userData?.data?.vehicles) {
    vehicle = Array.isArray(userData.data.vehicles) 
      ? userData.data.vehicles 
      : [userData.data.vehicles];
  }
  // Try path 3: userData.vehicles
  else if (userData?.vehicles) {
    vehicle = Array.isArray(userData.vehicles) 
      ? userData.vehicles 
      : [userData.vehicles];
  }
  // Try path 4: userData.data.vehicle
  else if (userData?.data?.vehicle) {
    vehicle = Array.isArray(userData.data.vehicle) 
      ? userData.data.vehicle 
      : [userData.data.vehicle];
  }
  // Try path 5: Check if any key contains "vehicle" in its name
  else {
    for (const key of Object.keys(dataSource)) {
      if (key.toLowerCase().includes('vehicle') || key.toLowerCase().includes('car')) {
        const value = dataSource[key];
        if (Array.isArray(value) && value.length > 0) {
          vehicle = value;
          break;
        } else if (value && typeof value === 'object') {
          vehicle = Array.isArray(value) ? value : [value];
          break;
        }
      }
    }
  }

  console.log("🚗 Vehicle data extracted:", vehicle);
  console.log("🚗 Vehicle count:", vehicle.length);
  if (vehicle.length > 0) {
    console.log("🚗 First vehicle:", vehicle[0]);
    console.log("🚗 Vehicle keys:", Object.keys(vehicle[0]));
  }

  // Extract feedback/reviews - try multiple paths
  let feedback: any[] = [];
  
  console.log("userData/Niyu", userData)
  if (userData?.result?.reviews && Array.isArray(userData.result.reviews)) {
    feedback = userData?.result?.reviews;
  } else if (userData?.reviews && Array.isArray(userData.reviews)) {
    feedback = userData?.reviews;
  } else if (userData?.result?.reviews && Array.isArray(userData.result.reviews)) {
    feedback = userData?.result.reviews;
  } else if (userData?.result?.feedback && Array.isArray(userData.result.feedback)) {
    feedback = userData?.result.feedback;
  }

  console.log("💬 Feedback extracted:", feedback.length);

  // Extract trip history - try multiple paths
  let th: any[] = [];
  
  if (userData?.result?.tripHistory && Array.isArray(userData.result.tripHistory)) {
    th = userData?.result?.tripHistory;
  } else if (userData?.tripHistory && Array.isArray(userData.tripHistory)) {
    th = userData.tripHistory;
  } else if (userData?.result?.tripHistory && Array.isArray(userData.result.tripHistory)) {
    th = userData.result.tripHistory;
  } else if (userData?.result?.trips && Array.isArray(userData.result.trips)) {
    th = userData.result.trips;
  }

  console.log("📋 Trip history extracted:", th.length);

  // Log extracted data summary
  console.log("📊 EXTRACTION SUMMARY:");
  console.log(`- Profile: ${Object.keys(profile).length > 0 ? '✅ Found' : '❌ Not found'}`);
  console.log(`- Vehicles: ${vehicle.length > 0 ? `✅ ${vehicle.length} found` : '❌ Not found'}`);
  console.log(`- Feedback: ${feedback.length > 0 ? `✅ ${feedback.length} found` : '❌ Not found'}`);
  console.log(`- Trip History: ${th.length > 0 ? `✅ ${th.length} found` : '❌ Not found'}`);

  // Safe name display
  const driverName = `${profile?.firstName || profile?.firstName || ''} ${profile?.lastName || profile?.lastName || ''}`.trim() || 'Unknown Driver';
  console.log("👤 Driver name:", driverName);
  
  // Safe date display
  const joinDate = profile?.createdAt || profile?.createdAt || profile?.joinDate
    ? new Date(profile?.createdAt || profile?.createdAt || profile?.joinDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : 'N/A';
  console.log("📅 Join date:", joinDate);

  // Handle error state
  if (error) {
    return (
      <div className="p-5">
        <Goback formerPage={"Drivers"} presentPage={"Error"} />
        <div className="bg-white p-5 rounded-lg my-5">
          <div className="text-center py-10">
            <h2 className="text-xl font-bold text-red-600">Error Loading Driver Data</h2>
            <p className="text-gray-500 mt-2">
              Unable to load driver information. The driver data might be incomplete or corrupted.
            </p>
            <Button 
              onClick={() => router.back()} 
              className="mt-4"
              variant="outline"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {!isFetching && !loading ? (
        <div>
          <Goback
            formerPage={"Drivers"}
            presentPage={driverName}
          />
          <div className="bg-white p-5 rounded-lg my-5 flex items-center justify-between lg:flex-row flex-col gap-y-10">
            <div className="w-full flex gap-x-3 items-center">
              <Avatar className="lg:w-32 h-28 lg:h-32 w-28">
                <AvatarImage src={profile?.profileImage || profile?.profileImage || profile?.avatar} />
                <AvatarFallback>
                  <IoPersonOutline className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
              <div className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                <div className="flex lg:flex-row flex-col lg:items-center justify-start lg:gap-x-5 gap-y-2">
                  <span className="text-xl font-extrabold text-start">
                    {driverName}
                  </span>
                  {profile?.status ? (
                    profile.status === "active" ? (
                      <div className="flex text-start items-center gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                        <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                        <span className="font-semibold text-xs capitalize">
                          {profile.status}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center text-start gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[--primary-orange]">
                        <span className="w-2 h-2 bg-[--primary-orange] rounded-full"></span>
                        <span className="font-semibold text-xs capitalize">
                          {profile.status}
                        </span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center text-start gap-x-2 p-1 rounded-full justify-center w-[100px] bg-gray-200 text-gray-600">
                      <span className="w-2 h-2 bg-gray-600 rounded-full"></span>
                      <span className="font-semibold text-xs">Unknown</span>
                    </div>
                  )}
                </div>
                <div className="lg:mt-3 mt-1 flex flex-col">
                  <span className="font-extrabold text-sm capitalize">
                    {profile?.role || profile?.type || 'driver'}
                  </span>
                  <span className="text-gray-400 text-xs">#{profile?.id || profile?._id || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col-reverse lg:flex-col gap-y-2 w-full lg:w-auto ">
              <div className="mb-5 hidden lg:flex justify-end gap-x-3 items-center text-2xl text-green-500 font-medium w-full text-end">
                <FaMoneyBillWave />
                {profile?.currentBalance === null || profile?.currentBalance === undefined
                  ? "NGN 0.00"
                  : formatCurrency(Number(profile.currentBalance), "NGN")}
              </div>
              {profile?.status === "active" ? (
                <Modal
                  trigger={
                    <Button
                      disabled={loadingToggle || isFetching}
                      variant={"outline"}
                      className="bg-[--danger] hover:bg-[--danger-btn] hover:text-white lg:w-[300px] h-10 lg:h-14 text-white"
                    >
                      Deactivate account
                    </Button>
                  }
                  title={""}
                  description={""}
                  content={
                    <ToggleStatus
                      toggle={toggleDriverStatus}
                      status={profile?.status || 'inactive'}
                      loading={loadingToggle}
                    />
                  }
                />
              ) : (
                <Modal
                  trigger={
                    <Button
                      disabled={loadingToggle || isFetching}
                      variant={"outline"}
                      className="bg-green-800 hover:bg-green-700 hover:text-white lg:w-[300px] h-10 lg:h-14 text-white"
                    >
                      Activate account
                    </Button>
                  }
                  title={""}
                  description={""}
                  content={
                    <ToggleStatus
                      toggle={toggleDriverStatus}
                      status={profile?.status || 'inactive'}
                      loading={loadingToggle}
                    />
                  }
                />
              )}
              <span className="text-left lg:text-right lg:me-5 text-sm">
                Joined {joinDate}
              </span>
            </div>
            <div className="lg:hidden flex gap-x-5 items-center text-2xl text-green-500 font-medium">
              <FaMoneyBillWave />
              {profile?.currentBalance === null || profile?.currentBalance === undefined
                ? "NGN 0.00"
                : formatCurrency(Number(profile.currentBalance), "NGN")}
            </div>
          </div>
          <ProfileVehicleDocs_Info
            th={th}
            feedback={feedback}
            vehicle={vehicle}
            profile={profile}
            loading={loading}
            isFetching={isFetching}
            driverId={id}
          />
        </div>
      ) : (
        <div>
          <Skeleton className="h-8 bg-gray-200 w-[250px]" />
          <Skeleton className="bg-gray-200 p-5 rounded-lg my-5 h-32 flex items-center justify-between lg:flex-row flex-col gap-y-10" />

          <div className="w-full grid lg:grid-cols-3 grid-cols-1 pt-5 mt-5 gap-8">
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