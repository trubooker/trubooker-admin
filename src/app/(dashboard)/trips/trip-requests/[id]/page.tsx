"use client";

import Goback from "@/components/Goback";
import {
  useGetSingleTripRequestQuery,
  useApproveTripRequestMutation,
  useDeclineTripRequestMutation,
} from "@/redux/services/Slices/tripsApiSlice";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { IoPersonOutline } from "react-icons/io5";

const SingleTripRequest = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data, isLoading, isFetching } = useGetSingleTripRequestQuery(id);
  const [approveTripRequest, { isLoading: isApproving }] =
    useApproveTripRequestMutation();
  const [declineTripRequest, { isLoading: isDeclining }] =
    useDeclineTripRequestMutation();

  const [declineNote, setDeclineNote] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const details = data?.result;
  const requester = details?.requester;
  const passenger = details?.passenger;
  const admin = details?.processedByAdmin;
  const linkedTrip = details?.linkedTrip;

  const loading = isLoading || isFetching;
  const isPending = details?.status === "pending";

  const statusStyles: Record<
    string,
    { bg: string; dot: string; text: string }
  > = {
    approved: { bg: "bg-[#CCFFCD]", dot: "bg-[#00B771]", text: "text-[#00B771]" },
    pending: { bg: "bg-[#FFF4E6]", dot: "bg-[#FFA500]", text: "text-[#FFA500]" },
    rejected: { bg: "bg-[#FFE6E6]", dot: "bg-[#FF4500]", text: "text-[#FF4500]" },
    cancelled: { bg: "bg-[#FFE6E6]", dot: "bg-[#FF4500]", text: "text-[#FF4500]" },
  };

  const renderStatus = (status?: string) => {
    if (!status) return "";
    const style = statusStyles[status] ?? {
      bg: "bg-gray-100",
      dot: "bg-gray-400",
      text: "text-gray-500",
    };
    return (
      <div
        className={`flex items-center gap-x-2 p-1 rounded-full justify-center w-fit px-3 ${style.bg} ${style.text}`}
      >
        <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
        <span className="font-semibold text-xs capitalize">{status}</span>
      </div>
    );
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch {
      return "Invalid date";
    }
  };

  const handleApprove = async () => {
    setActionError(null);
    try {
      await approveTripRequest(id).unwrap();
    } catch (err) {
      setActionError("Failed to approve trip request. Please try again.");
    }
  };

  const handleDecline = async () => {
    setActionError(null);
    try {
      await declineTripRequest({ tripid: id, adminNote: declineNote }).unwrap();
      setShowDeclineInput(false);
      setDeclineNote("");
    } catch (err) {
      setActionError("Failed to decline trip request. Please try again.");
    }
  };

  return (
    <div>
      {loading ? (
        <div>
          <Skeleton className="h-8 bg-gray-200 w-[250px]" />
          <div className="w-full grid lg:grid-cols-2 grid-cols-1 pt-5 mt-5 gap-8">
            <Skeleton className="bg-gray-200 h-[300px] w-full rounded-xl" />
            <Skeleton className="bg-gray-200 h-[300px] w-full rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Goback
              formerPage="Trip Requests"
              presentPage={`Request Id - #${details?.id?.slice(0, 8)}`}
            />

            {/* Action buttons — only show for pending requests */}
            {isPending && (
              <div className="flex items-center gap-x-3">
                <Button
                  onClick={handleApprove}
                  disabled={isApproving || isDeclining}
                  className="bg-[#00B771] hover:bg-[#00A366] text-white"
                >
                  {isApproving ? "Approving..." : "Approve"}
                </Button>
                <Button
                  onClick={() => setShowDeclineInput((prev) => !prev)}
                  disabled={isApproving || isDeclining}
                  variant="outline"
                  className="border-[#FF4500] text-[#FF4500] hover:bg-[#FFE6E6]"
                >
                  Decline
                </Button>
              </div>
            )}
          </div>

          {/* Inline error message */}
          {actionError && (
            <div className="mt-3 p-3 rounded-md bg-[#FFE6E6] text-[#FF4500] text-sm">
              {actionError}
            </div>
          )}

          {/* Decline reason input — appears when Decline is clicked */}
          {showDeclineInput && (
            <Card className="mt-4 border-[#FFE6E6]">
              <CardContent className="pt-4">
                <label className="text-xs text-gray-500 font-normal">
                  Reason for declining (optional)
                </label>
                <textarea
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  className="w-full mt-2 p-2 border rounded-md text-sm"
                  rows={3}
                  placeholder="Add a note for the requester..."
                />
                <div className="flex justify-end gap-x-3 mt-3">
                  <Button
                    variant="ghost"
                    onClick={() => setShowDeclineInput(false)}
                    disabled={isDeclining}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDecline}
                    disabled={isDeclining}
                    className="bg-[#FF4500] hover:bg-[#E03E00] text-white"
                  >
                    {isDeclining ? "Declining..." : "Confirm Decline"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex xl:flex-row flex-col w-full mt-5 gap-4">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 xl:w-[45%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-500">
                    Request Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Origin
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {details?.origin ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Destination
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {details?.destination ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Requested date
                        </span>
                        <span className="font-medium text-sm">
                          {formatDate(details?.requestedDate)}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Seats
                        </span>
                        <span className="font-medium text-sm">
                          {details?.seats ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Status
                        </span>
                        <div className="mt-1">{renderStatus(details?.status)}</div>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Processed at
                        </span>
                        <span className="font-medium text-sm">
                          {details?.processedAt
                            ? formatDate(details.processedAt)
                            : "Not processed"}
                        </span>
                      </div>
                    </div>

                    {details?.note ? (
                      <div className="flex flex-col w-full">
                        <span className="font-normal text-xs text-gray-500">
                          Passenger Note
                        </span>
                        <Separator className="my-3" />
                        <span className="font-medium text-sm">
                          {details.note}
                        </span>
                      </div>
                    ) : null}

                    {details?.adminNote ? (
                      <div className="flex flex-col w-full">
                        <span className="font-normal text-xs text-gray-500">
                          Admin Note
                        </span>
                        <Separator className="my-3" />
                        <span className="font-medium text-sm">
                          {details.adminNote}
                        </span>
                      </div>
                    ) : null}

                    {linkedTrip ? (
                      <div className="flex flex-col w-full">
                        <span className="font-normal text-xs text-gray-500">
                          Linked Trip
                        </span>
                        <Separator className="my-3" />
                        <span className="font-medium text-sm">
                          #{linkedTrip?.id}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col w-full">
                        <span className="font-normal text-xs text-gray-500">
                          Linked Trip
                        </span>
                        <Separator className="my-3" />
                        <span className="italic text-sm text-gray-400">
                          Not linked to a trip yet
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-500">
                    Processed By
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {admin ? (
                    <div className="flex items-center gap-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={admin?.profilePhoto ?? undefined} />
                        <AvatarFallback>
                          <IoPersonOutline className="w-5 h-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">
                          {admin?.fullName ??
                            `${admin?.firstName ?? ""} ${admin?.lastName ?? ""}`}
                        </span>
                        <span className="text-xs text-gray-500">
                          {admin?.email}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {admin?.metadata?.department ?? admin?.role}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <span className="italic text-sm text-gray-400">
                      Not yet processed
                    </span>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4 xl:w-[55%]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-500">
                    Requester Info
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-x-4 mb-6">
                    <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                      <AvatarImage src={requester?.profileImage} />
                      <AvatarFallback>
                        <IoPersonOutline className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm capitalize">
                        {requester?.firstName} {requester?.lastName}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {requester?.role}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Email
                        </span>
                        <span className="font-medium text-sm">
                          {requester?.email ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Phone
                        </span>
                        <span className="font-medium text-sm">
                          {requester?.phone ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Gender
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {requester?.gender ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Date of birth
                        </span>
                        <span className="font-medium text-sm">
                          {formatDate(requester?.dob)}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          City / State
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {requester?.city ?? "N/A"}, {requester?.state ?? "N/A"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Country
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {requester?.country ?? "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-normal text-xs text-gray-500">
                        Address
                      </span>
                      <span className="font-medium text-sm">
                        {requester?.address ?? "N/A"}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Email verified
                        </span>
                        <span className="font-medium text-sm">
                          {requester?.isEmailVerified ? "Yes" : "No"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Phone verified
                        </span>
                        <span className="font-medium text-sm">
                          {requester?.isPhoneVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg text-gray-500">
                    Passenger Account
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Wallet balance
                        </span>
                        <span className="font-medium text-sm">
                          ₦{passenger?.walletBalance ?? "0.00"}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Total trips
                        </span>
                        <span className="font-medium text-sm">
                          {passenger?.totalTrips ?? 0}
                        </span>
                      </div>
                    </div>

                    {(passenger?.nxt_kin_name ||
                      passenger?.nxt_kin_relationship ||
                      passenger?.nxt_kin_telephone) && (
                      <div className="flex flex-col w-full">
                        <span className="font-normal text-xs text-gray-500">
                          Next of Kin
                        </span>
                        <Separator className="my-3" />
                        <span className="font-medium text-sm">
                          {passenger?.nxt_kin_name ?? "N/A"} (
                          {passenger?.nxt_kin_relationship ?? "N/A"}) —{" "}
                          {passenger?.nxt_kin_telephone ?? "N/A"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SingleTripRequest;