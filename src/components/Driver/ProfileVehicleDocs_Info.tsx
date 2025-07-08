"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriversTable from "@/components/Driver/Driver";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Link from "next/link";
import StarRatings from "react-star-ratings";
import { IoPersonOutline } from "react-icons/io5";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FaExternalLinkAlt } from "react-icons/fa";
import { FaRegFileLines } from "react-icons/fa6";
import { Skeleton } from "../ui/skeleton";
import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import {
  useRejectDriversDocumentsMutation,
  useApproveDriversDocumentsMutation,
  useGetDriversDocumentsQuery,
} from "@/redux/services/Slices/driverApiSlice";
import { Button } from "../ui/button";
import { Modal } from "../DualModal";
import toast from "react-hot-toast";
import { Textarea } from "../ui/textarea";

const ProfileVehicleDocs_Info = ({
  th,
  feedback,
  vehicle,
  profile,
  loading,
  isFetching,
  driverId,
}: any) => {
  const [reason, setReason] = useState("");
  const [reasonError, setReasonError] = useState("");
  const { data: driverDocs } = useGetDriversDocumentsQuery(driverId);
  const [approveDocs, { isLoading: approveLoading }] =
    useApproveDriversDocumentsMutation();
  const [rejectDocs, { isLoading: rejectLoading }] =
    useRejectDriversDocumentsMutation(driverId);

  const handleApproveDocument = async (
    id: string,
    onModalClose?: () => void
  ) => {
    await approveDocs(id)
      .unwrap()
      .then((res) => {
        toast.success("Document Approved");
        onModalClose?.();
      });
  };

  const validateReason = (value: string) => {
    if (value.length < 6) {
      setReasonError("Reason must be at least 6 characters long");
      return false;
    }
    setReasonError("");
    return true;
  };

  const handleDisapproveDocument = async ({
    reason,
    id,
    onModalClose,
  }: {
    reason: string;
    id: string;
    onModalClose?: () => void;
  }) => {
    if (!validateReason(reason)) {
      return;
    }

    await rejectDocs({ reason: reason, documentVerificationId: id })
      .unwrap()
      .then((res) => {
        toast.error("Document Rejected");
        setReason("");
        setReasonError("");
        onModalClose?.();
      });
  };

  const docs: any[] = driverDocs?.data;
  return (
    <div className="w-full">
      <div className="gap-4 grid xl:grid-cols-3 grid-rows-1 w-full">
        {/* profile  */}
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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
                    <span className="font-medium text-sm">
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

        {/* vehicle info */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {vehicle?.map((deets: any, index: number) => (
                <Accordion
                  key={deets.id}
                  type="single"
                  collapsible
                  // defaultValue="item-1"
                  className="w-full"
                >
                  <AccordionItem value={`item-${index + 1}`} className="">
                    <AccordionTrigger className="my-3">
                      <Table className="w-full">
                        <TableHeader>
                          <TableRow className="text-xs lg:text-sm">
                            <TableHead className="font-bold w-1/2 text-left">
                              <div className="flex flex-col">
                                <span className="font-normal text-xs text-gray-500">
                                  Vehicle Type
                                </span>
                                <span className="font-medium text-sm">
                                  {deets?.vehicle_type?.name === null ? (
                                    <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                  ) : (
                                    deets?.vehicle_type?.name
                                  )}
                                </span>
                              </div>
                            </TableHead>

                            <TableHead className="font-bold w-1/2 text-left">
                              <div className="flex text-end flex-col">
                                <span className="font-normal text-xs text-gray-500">
                                  Vehicle Model
                                </span>
                                <span className="font-medium text-sm">
                                  {deets?.model === null ? (
                                    <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                                  ) : (
                                    deets?.model
                                  )}
                                </span>
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                      </Table>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="my-5 space-y-6">
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              License plate number
                            </span>
                            <span className="font-medium text-sm">
                              {deets?.license_plate_number === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.license_plate_number
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Vehicle capacity
                            </span>
                            <span className="font-medium text-sm">
                              {deets?.capacity === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.capacity
                              )}{" "}
                              Seats
                            </span>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <div className="flex flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Vehicle colour
                            </span>
                            <span className="font-medium text-sm">
                              {deets?.color === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.color
                              )}
                            </span>
                          </div>
                          <div className="flex text-end flex-col">
                            <span className="font-normal text-xs text-gray-500">
                              Insurance
                            </span>
                            <span className="font-medium text-sm">
                              {deets?.insurance === null ? (
                                <Skeleton className="h-4 mt-2 w-auto bg-gray-200" />
                              ) : (
                                deets?.insurance
                              )}
                            </span>
                          </div>
                        </div>

                        <Tabs defaultValue="vehiclePhotos" className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="vehiclePhotos">
                              Photos
                            </TabsTrigger>
                            <TabsTrigger value="features">Features</TabsTrigger>
                          </TabsList>
                          <TabsContent value="vehiclePhotos">
                            <div className="w-full grid grid-cols-1 pt-5 gap-4">
                              {deets?.photos?.map((i: any, index: number) => (
                                <div key={index}>
                                  <Link href={i} target="_blank">
                                    <span className="font-medium text-sm">
                                      <span className="flex gap-x-2 items-center">
                                        <Image
                                          src={"/photoGrid.svg"}
                                          alt="Vehicle Photo"
                                          width={35}
                                          height={35}
                                        />

                                        <div className="text-sm font-medium text-[#333F53]">
                                          Vehicle photo {index + 1}.png
                                        </div>
                                      </span>
                                    </span>
                                  </Link>
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                          <TabsContent value="features">
                            <div className="w-full grid grid-cols-1 pt-5 mt-5 gap-8">
                              {deets?.features?.length > 1 ? (
                                <div>
                                  <span className="font-medium text-sm">
                                    <span className="flex gap-x-2 items-center">
                                      <div className="text-sm font-medium text-[#333F53]">
                                        {deets.features.join(", ")}
                                      </div>
                                    </span>
                                  </span>
                                </div>
                              ) : (
                                deets?.features?.map(
                                  (i: any, index: number) => (
                                    <div key={index}>
                                      <span className="font-medium text-sm">
                                        <span className="flex gap-x-2 items-center">
                                          <div className="text-sm font-medium text-[#333F53]">
                                            {i}
                                          </div>
                                        </span>
                                      </span>
                                    </div>
                                  )
                                )
                              )}
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* vehicle docs */}
        <Card className="h-auto">
          <CardHeader>
            <CardTitle className="text-lg text-gray-500">
              Vehicle Document
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              {docs?.length > 0 ? (
                <div className="mb-3">
                  <div className="max-h-[500px] h-auto overflow-y-auto">
                    <div className="grid grid-cols-1 gap-8">
                      {docs?.map((doc: any, index: number) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <Link href={doc.link} target="_blank">
                            <span className="font-medium text-sm">
                              <span className="flex gap-x-2 items-start">
                                <FaRegFileLines className="w-[35px] h-[35px] mt-1 text-gray-700" />
                                <div className="flex flex-col">
                                  <div className="text-sm font-bold items-center flex gap-x-2 text-[#333F53] capitalize">
                                    <>{doc.verification_type}</>
                                    <FaExternalLinkAlt className="w-3 h-3" />
                                  </div>
                                  <div className="text-xs mt-2 text-gray-500">
                                    <span
                                      className={`${
                                        doc.status === "approved"
                                          ? "text-green-600 font-medium"
                                          : doc.status === "pending"
                                          ? "text-yellow-600 font-medium"
                                          : "text-red-600 font-medium"
                                      } capitalize`}
                                    >
                                      {doc.status}
                                    </span>
                                  </div>
                                  <div className="text-[11px] mt-1 text-gray-500">
                                    Added:{" "}
                                    {new Date(
                                      doc.created_at
                                    ).toLocaleDateString("en-US", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </div>
                                </div>
                              </span>
                            </span>
                          </Link>

                          {/* Buttons for approve/disapprove */}
                          <div className="mt-4 flex gap-x-2">
                            <Modal
                              trigger={
                                <Button
                                  disabled={doc.status === "approved"}
                                  className={`px-3 py-1.5 w-full text-xs font-bold rounded-md ${
                                    doc.status === "approved"
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-green-500 text-white hover:bg-green-600"
                                  }`}
                                >
                                  {doc.status === "approved"
                                    ? "Approved"
                                    : "Approve"}
                                </Button>
                              }
                              title={"Approve Document"}
                              description={""}
                              content={
                                <div className="flex flex-col space-y-4 lg:mb-4">
                                  <p className="text-sm text-gray-600">
                                    Are you sure you want to approve this
                                    document? This action cannot be undone.
                                  </p>
                                  <div className="flex justify-end space-x-3 pt-4">
                                    <Button
                                      disabled={approveLoading}
                                      className="px-4 py-2 text-sm font-medium text-white w-full bg-green-600 hover:bg-green-500 rounded-md"
                                      onClick={() => {
                                        handleApproveDocument(doc.id);
                                      }}
                                    >
                                      {approveLoading
                                        ? "Approving"
                                        : "Yes, Approve"}
                                    </Button>
                                  </div>
                                </div>
                              }
                            />

                            <Modal
                              trigger={
                                <Button
                                  disabled={doc.status === "rejected"}
                                  className={`px-3 py-1.5 text-xs rounded-md w-full font-bold ${
                                    doc.status === "rejected"
                                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                      : "bg-red-500 text-white hover:bg-red-600"
                                  }`}
                                >
                                  {doc.status === "rejected"
                                    ? "Rejected"
                                    : "Reject"}
                                </Button>
                              }
                              title={"Reject Document"}
                              description={"Enter reason for rejection"}
                              content={
                                <div className="flex flex-col space-y-4 lg:mb-4">
                                  <p className="text-sm text-gray-600 mb-2">
                                    Please provide a reason for rejecting this
                                    document. This will be shared with the
                                    driver.
                                  </p>
                                  <div className="space-y-4 mx-1">
                                    <div className="space-y-2">
                                      <Textarea
                                        value={reason}
                                        onChange={(e) => {
                                          setReason(e.target.value);
                                          validateReason(e.target.value);
                                        }}
                                        placeholder="Enter reason for rejection..."
                                        className={`w-full text-sm border rounded-md h-24 ${
                                          reasonError
                                            ? "border-red-500"
                                            : "border-gray-300"
                                        }`}
                                      />
                                      {reasonError && (
                                        <p className="text-red-500 text-xs">
                                          {reasonError}
                                        </p>
                                      )}
                                    </div>
                                    <div className="flex justify-end space-x-3 pt-5">
                                      <Button
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-400 w-full hover:bg-red-500 rounded-md disabled:bg-red-200"
                                        onClick={() => {
                                          handleDisapproveDocument({
                                            reason: reason,
                                            id: doc.id,
                                          });
                                        }}
                                        disabled={
                                          rejectLoading || reason.length < 6
                                        }
                                      >
                                        {rejectLoading
                                          ? "Submitting..."
                                          : "Submit Rejection"}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center w-full h-[400px] flex-col justify-center">
                  <Image
                    src={"/nodata.svg"}
                    alt=""
                    width={200}
                    height={200}
                    className="object-cover me-5"
                  />
                  <h1 className="mt-8 text-lg text-center font-semibold">
                    No Data
                  </h1>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* trip history */}
        <ScrollArea className="w-full lg:col-span-2 col-span-1 text-lg text-gray-500">
          <div className="bg-white rounded-lg w-full p-5">
            <div className="py-4">
              <h2 className="text-base font-bold">Trip history</h2>
            </div>
            <DriversTable data={th} loading={loading} isFetching={isFetching} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* feedback  */}
        <Card className="w-full overflow-auto h-[500px]">
          <CardHeader className="lg-white text-left">
            <CardTitle className="text-lg text-gray-500">
              Passengers Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {feedback?.length > 0 ? (
              <>
                {feedback?.map((actions: any) => (
                  <div key={actions.id}>
                    <Separator />
                    <div className="my-6">
                      <div className="flex w-full items-start space-x-4">
                        <Avatar className="lg:w-14 h-10 lg:h-14 w-10">
                          <AvatarImage src={actions?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline className="w-5 h-5" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="">
                          <p className="text-gray-800 font-bold text-sm">
                            {actions?.passenger}
                          </p>
                          {/* <p className="text-xs text-gray-500">
                            {actions.email}
                          </p> */}
                          <span className="flex items-center gap-x-3">
                            {actions?.rating}.0{" "}
                            <StarRatings
                              rating={actions?.rating}
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
                      <div className="text-sm mt-3">{actions?.comment}</div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center w-full h-[400px] flex-col justify-center">
                <Image
                  src={"/nodata.svg"}
                  alt=""
                  width={200}
                  height={200}
                  className="object-cover me-5"
                />
                <h1 className="mt-8 text-lg text-center font-semibold">
                  No Data
                </h1>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileVehicleDocs_Info;
