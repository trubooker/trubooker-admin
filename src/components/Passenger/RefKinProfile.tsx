"use client";

import React, { FC, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefKinProfileTable } from "./RefKinProfileTable";
import { SinglePassengerReferalData } from "@/constants";
import Pagination from "../Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Modal } from "../DualModal";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// ✅ Import the exact same hook used in the driver profile
import { useDeleteUserMutation } from "@/redux/services/Slices/driverApiSlice";

interface Props {
  ref: string[];
  nok: {
    name: string | null;
    phone_number: string | null;
    relationship: string | null;
  };
  profile: {
    id?: string; // Ensure the user ID is passed down
    address: string | null;
    city: string | null;
    country: string | null;
    createdAt: string | null;
    deletedAt: string | null;
    dob: string | null;
    email: string | null;
    email_verified_at: string | null;
    firstName: string | null;
    gender: string | null;
    lastName: string | null;
    phone: string | null;
    referral: string | null;
    referred_by: string | null;
    type: string | null;
    status: string | null;
    updatedAt: string | null;
  };
}

const RefKinProfile: FC<Props> = ({ ref, nok, profile }) => {
  const router = useRouter();
  const loading: boolean = false;
  const isFetching: boolean = false;
  const userData: any = SinglePassengerReferalData;
  const [page, setPage] = useState(1);

  // ✅ Use the driver API mutation
  const [deleteUser, { isLoading: deleteUserLoading }] = useDeleteUserMutation();

  // Delete state
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteReasonError, setDeleteReasonError] = useState("");

  const totalPages = userData?.data?.instructors?.last_page;
  const onPageChange = (pageNumber: number) => {
    if (!isFetching && pageNumber !== page) {
      setPage(pageNumber);
    }
  };

  const validateDeleteReason = (value: string) => {
    if (value.trim().length < 6) {
      setDeleteReasonError("Reason must be at least 6 characters long");
      return false;
    }
    setDeleteReasonError("");
    return true;
  };

  const handleDeleteUser = async (onModalClose?: () => void) => {
    // Use profile.id, or fallback to profile.referral if that's the UUID
    const userId = profile?.id || profile?.referral;

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

      toast.success("User deleted successfully");
      setDeleteReason("");
      setDeleteReasonError("");
      onModalClose?.();

      // Navigate back to the passengers list
      router.push("/passengers");
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      const msg =
        error?.data?.message ||
        error?.data?.error?.message ||
        "Failed to delete user";
      toast.error(msg);
    }
  };

  return (
    <div>
      <div className="flex xl:flex-row flex-col w-full gap-4">
        <div className="flex flex-col gap-4 xl:w-[40%]">
          <div>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-gray-500">
                  Profile Information
                </CardTitle>
                
                {/* ✅ Delete Button */}
                <Modal
                  trigger={
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded-md flex items-center gap-2"
                      title="Delete user account"
                    >
                      <FaTrash className="w-3 h-3" />
                      Delete
                    </Button>
                  }
                  title="Delete User Account"
                  description="This action is irreversible. Please provide a reason."
                  content={
                    <div className="flex flex-col space-y-4 lg:mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        You are about to permanently delete{" "}
                        <span className="font-semibold text-gray-800">
                          {profile?.firstName
                            ? `${profile.firstName} ${profile.lastName || ""}`.trim()
                            : "this user"}
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
                    <div className="flex justify-between">
                      <div className="flex flex-col">
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
                        <span className="font-medium text-sm capitalize">
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
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-gray-500">
                  Next of Kin Information
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
                          {nok?.name === null ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.name
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
                          {nok?.phone_number === null ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.phone_number
                          )}
                        </span>
                      </div>
                      <div className="flex text-end flex-col">
                        <span className="font-normal text-xs text-gray-500">
                          Relationship
                        </span>
                        <span className="font-medium text-sm capitalize">
                          {nok?.relationship === null ? (
                            <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                          ) : (
                            nok?.relationship
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="xl:w-[60%] h-full bg-white rounded-lg w-full p-5">
          <div className="flex gap-x-3 items-center ps-3 mb-5">
            <div className="text-lg text-gray-500 font-bold">
              Referral Information
            </div>
            <div className="flex items-center justify-center rounded-full px-2 bg-orange-500 text-white">
              {ref?.length}
            </div>
          </div>
          {isFetching || loading ? (
            <>
              <Table className="">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm">
                    <TableHead className="text-left font-bold w-1/3">
                      Name
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Date referred
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3].map((i) => (
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
            <ScrollArea className="h-[550px]">
              <RefKinProfileTable
                data={ref}
                isFetching={isFetching}
                loading={loading}
              />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
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
    </div>
  );
};

export default RefKinProfile;