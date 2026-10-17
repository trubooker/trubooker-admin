import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Referral from "./Referral/Agents";
import Withdrawal from "./Withdrawal/Agents";
import { Skeleton } from "../ui/skeleton";
import CountUp from "react-countup";
import { Button } from "../ui/button";
import { Modal } from "../DualModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// ✅ Import the exact same hook
import { useDeleteUserMutation } from "@/redux/services/Slices/driverApiSlice";

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
  const router = useRouter();

  // ✅ Delete User logic
  const [deleteUser, { isLoading: deleteUserLoading }] = useDeleteUserMutation();
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonError, setDeleteReasonError] = useState("");

  const validateDeleteReason = (value: string) => {
    if (value.trim().length < 6) {
      setDeleteReasonError("Reason must be at least 6 characters long");
      return false;
    }
    setDeleteReasonError("");
    return true;
  };

  const handleDeleteUser = async (onModalClose?: () => void) => {
    const userId = profile?.id || profile?.uuid || profile?.referralCode; // Adjust fallback if needed

    if (!userId) {
      toast.error("User ID is missing");
      return;
    }

    if (!validateDeleteReason(deleteReason)) return;

    try {
      await deleteUser({
        userId: userId,
        deleteReason: deleteReason.trim(),
      }).unwrap();

      toast.success("Agent deleted successfully");
      setDeleteReason("");
      setDeleteReasonError("");
      onModalClose?.();

      // Navigate back to the agents list
      router.push("/agents");
    } catch (error: any) {
      console.error("Failed to delete agent:", error);
      const msg =
        error?.data?.message ||
        error?.data?.error?.message ||
        "Failed to delete agent";
      toast.error(msg);
    }
  };

  return (
    <div className="w-full">
      <div className="gap-4 flex xl:flex-row flex-col w-full">
        <div className="xl:w-[40%] w-full">
          <Card className="h-auto w-full mb-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg text-gray-500">
                Profile Information
              </CardTitle>

              {/* ✅ Delete Button */}
              <Modal
                trigger={
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md flex items-center gap-2"
                    title="Delete agent account"
                  >
                    <FaTrash className="w-3 h-3" />
                    Delete
                  </Button>
                }
                title="Delete Agent Account"
                description="This action is irreversible. Please provide a reason."
                content={
                  <div className="flex flex-col space-y-4 lg:mb-4">
                    <p className="text-sm text-gray-600 mb-2">
                      You are about to permanently delete{" "}
                      <span className="font-semibold text-gray-800">
                        {profile?.firstName
                          ? `${profile.firstName} ${profile.lastName || ""}`.trim()
                          : "this agent"}
                      </span>
                      . This will remove their account and associated data. This
                      action cannot be undone.
                    </p>

                    <div className="space-y-2">
                      <Label htmlFor="deleteReason">Reason for deletion</Label>
                      <Textarea
                        id="deleteReason"
                        value={deleteReason}
                        onChange={(e) => {
                          setDeleteReason(e.target.value);
                          validateDeleteReason(e.target.value);
                        }}
                        placeholder="e.g., Fraudulent account"
                        className={`w-full text-sm border rounded-md h-24 ${
                          deleteReasonError ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {deleteReasonError && (
                        <p className="text-red-500 text-xs">
                          {deleteReasonError}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 w-full hover:bg-red-700 rounded-md disabled:bg-red-300"
                        onClick={() => handleDeleteUser()}
                        disabled={
                          deleteUserLoading || deleteReason.trim().length < 6
                        }
                      >
                        {deleteUserLoading ? "Deleting..." : "Yes, Delete Account"}
                      </Button>
                    </div>
                  </div>
                }
              />
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
                        {profile?.firstName === null ||
                        profile?.lastName === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          <div className="flex gap-x-2">
                            <span> {profile?.firstName}</span>
                            <span> {profile?.lastName}</span>
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
                        {profile?.referralCode === null ? (
                          <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                        ) : (
                          profile?.referralCode
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