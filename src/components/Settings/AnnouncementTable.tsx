/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "../DualModal";
import UpdateBroadcastMessage from "../UpdateBroadcastMessage";

const AnnouncementTable = ({
  refetch,
  notifications,
  isFetching,
  loading,
}: any) => {
  return (
    <>
      <div>
        {notifications?.length > 0 ? (
          <Table className=" min-w-[900px] py-2">
            <TableHeader>
              <TableRow className="text-xs lg:text-sm">
                <TableHead className="font-bold w-1/4">Title</TableHead>
                <TableHead className="font-bold w-1/4 text-center">
                  Target Audience
                </TableHead>
                <TableHead className="font-bold w-1/4 text-center">
                  Date/Time
                </TableHead>
                <TableHead className="text-center font-bold w-1/4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <>
                <>
                  {notifications?.map((notification: any) => (
                    <TableRow
                      key={notification.id}
                      className="text-xs lg:text-sm w-full"
                    >
                      <TableCell className=" py-5 text-left">
                        {notification.title}
                      </TableCell>
                      <TableCell className=" py-5 text-center capitalize">
                        {notification.target}
                      </TableCell>
                      <TableCell className=" py-5 text-[--primary] text-center">
                        {new Date(notification?.created_at).toLocaleString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false,
                          }
                        )}
                      </TableCell>
                      <TableCell className="text-center flex gap-x-5">
                        <Modal
                          trigger={
                            <button className="text-indigo-600 text-center mx-auto">
                              View
                            </button>
                          }
                          title={notification?.title}
                          description={`ID: ${notification?.id} `}
                          content={
                            <>
                              <div className="text-sm lg:text-base">
                                <p className="mb-4">{notification?.body}</p>
                                <p className="mb-2 capitalize">
                                  <strong>Target audience:</strong>{" "}
                                  {notification.target}
                                </p>
                                <p className="mb-4">
                                  <strong>Date Sent/Scheduled Date:</strong>{" "}
                                  {new Date(
                                    notification?.created_at
                                  ).toLocaleString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: false,
                                  })}
                                </p>
                                <p>
                                  <strong>Attachment:</strong>
                                </p>
                                {notification?.attachment ? (
                                  // <div className="relative w-full object-cover h-[200px]">
                                  //   <Image
                                  //     src={notification?.attachment}
                                  //     alt="Attachment"
                                  //     className="mt-4 rounded-lg w-full"
                                  //     fill
                                  //   />
                                  // </div>
                                  <img
                                    src={notification?.attachment}
                                    alt={""}
                                    className="w-full h-96 object-cover rounded-md mb-4"
                                  />
                                ) : (
                                  "No attachment"
                                )}
                              </div>
                            </>
                          }
                        />
                        {/* </TableCell>
                      <TableCell className="text-center"> */}
                        <Modal
                          trigger={
                            <button className="text-indigo-600 text-center mx-auto">
                              Update
                            </button>
                          }
                          title={notification?.title}
                          description={`ID: ${notification?.id} `}
                          content={
                            <UpdateBroadcastMessage
                              notification={notification}
                              refetch={refetch}
                            />
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              </>
            </TableBody>
          </Table>
        ) : (
          <>
            {isFetching || loading ? (
              <>
                <Table className="">
                  <TableHeader>
                    <TableRow className="text-xs lg:text-sm">
                      <TableHead className="text-left font-bold w-1/7">
                        Name
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Email
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Country
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Courses Enrolled
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Last Login
                      </TableHead>
                      <TableHead className="font-bold w-1/7 text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-center font-bold w-1/7">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                      <TableRow key={i}>
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
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
          </>
        )}
      </div>
    </>
  );
};

export default AnnouncementTable;
