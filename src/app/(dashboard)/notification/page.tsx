"use client";

import React, { useState } from "react";
import { useFetchNotificationsQuery } from "@/redux/services/Slices/notificationApiSlice";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import Logo from "@/public/trubookerNotification.svg";
import { truncateText } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Modal } from "@/components/DualModal";
import NotificationOpenModal from "@/components/notificationOpenModal";
import Broadcast from "@/components/notifications/Broadcast";
import SendBroadcastMessage from "@/components/SendBroadcastMessage";
import Announcement from "@/components/notifications/Announcement";
import { FaPaperPlane } from "react-icons/fa";
import Pagination from "@/components/Pagination";

interface NotificationRecipient {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  recipient?: NotificationRecipient;
}

interface NotificationsMeta {
  page: number;
  limit: number;
  count: number;
  totalRecords: number;
  pageCount: number;
  nextPage: number | null;
  previousPage: number | null;
}

interface NotificationProps {
  role?: "passenger" | "driver" | "agent" | "all"; // Add more roles as needed
}

const Notification = ({ role = "all" }: NotificationProps) => {
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState<"unread" | "read">("unread");
  
  console.log(`📢 Notification component rendered with role: ${role}`);
  console.log(`📋 Current viewType: ${viewType}`);
  
  const { data, isLoading, isFetching, refetch } = useFetchNotificationsQuery({
    type: viewType,
    // Pass role to the query if your API supports it
    ...(role !== "all" && { role }),
  });

  console.log("📡 Fetch query state:", { data, isLoading, isFetching });

  // data.result = { data: NotificationItem[], meta: NotificationsMeta }
  let notifications: NotificationItem[] = data?.result?.data ?? [];
  const meta: NotificationsMeta | undefined = data?.result?.meta;
  const totalPages: number = meta?.pageCount ?? 0;

  // Filter notifications by role if API doesn't support role filtering
  if (role !== "all" && notifications.length > 0) {
    console.log(`🔍 Filtering notifications for role: ${role}`);
    notifications = notifications.filter(
      (notification) => notification.recipient?.role === role
    );
    console.log(`📨 Filtered notifications count: ${notifications.length}`);
  }

  console.log(`📨 Total notifications after filtering: ${notifications.length}`);
  console.log(`📄 Total pages: ${totalPages}`);

  const onPageChange = (pageNumber: number) => {
    console.log(`🔄 Page change requested: ${pageNumber}`);
    if (
      !isFetching &&
      pageNumber !== page &&
      pageNumber >= 1 &&
      pageNumber <= totalPages
    ) {
      console.log(`✅ Changing page from ${page} to ${pageNumber}`);
      setPage(pageNumber);
    }
  };

  const handleViewToggle = (newViewType: "unread" | "read") => {
    console.log(`🔄 Toggling view from "${viewType}" to "${newViewType}"`);
    setViewType(newViewType);
  };

  return (
    <div className="flex flex-col w-full px-5">
      <div className="flex items-start justify-between gap-x-3 ">
        <h2 className="text-2xl font-bold mb-10">
          {role !== "all" ? `${role.charAt(0).toUpperCase() + role.slice(1)} Notifications` : "All Notifications"}
        </h2>
        {role === "all" && (
          <Modal
            trigger={
              <Button className="text-xs bg-[--primary] text-white hover:bg-[--primary-btn]">
                <FaPaperPlane />{" "}
                <span className="hidden lg:block"> Send New Message</span>
              </Button>
            }
            title={"Send New Message"}
            description={"Create a new broadcast message"}
            content={<SendBroadcastMessage />}
          />
        )}
      </div>

      <div className="flex flex-col h-fit w-full">
        <Tabs defaultValue="system" className="w-full">
          <TabsList className="grid w-8/12 justify-start text-center h-full grid-rows-1 xl:grid-cols-3 gap-y-3 mb-5">
            <TabsTrigger 
              className="me-auto xl:w-full" 
              value="system"
              onClick={() => handleViewToggle("unread")}
            >
              System Alerts
            </TabsTrigger>
            {role === "all" && (
              <>
                <TabsTrigger 
                  className="me-auto xl:w-full" 
                  value="broadcast"
                  onClick={() => handleViewToggle("unread")}
                >
                  Broadcast
                </TabsTrigger>
                <TabsTrigger 
                  className="me-auto xl:w-full" 
                  value="announcement"
                  onClick={() => handleViewToggle("unread")}
                >
                  Announcements
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="system" className="mt-10">
            <div className="flex flex-col gap-y-4">
              {isLoading ? (
                <Spinner />
              ) : notifications.length > 0 ? (
                notifications.map((notification, index) => {
                  console.log(`📋 Rendering notification ${index + 1}:`, {
                    id: notification.id,
                    title: notification.title,
                    recipientRole: notification.recipient?.role,
                    isRead: notification.isRead
                  });
                  return (
                    <div key={notification.id}>
                      <div className="flex items-center">
                        <div className="flex w-full items-start space-x-4">
                          <Image
                            src={Logo}
                            width="40"
                            alt="Logo"
                            className="flex"
                          />
                          <div className="flex flex-col h-auto min-h-[130px]">
                            <div>
                              <p className="text-gray-800 font-semibold text-sm lg:text-base">
                                {notification.title}
                              </p>
                              <small className="my-5 text-[11px] text-gray-500">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: false,
                                })}
                              </small>
                              {role !== "all" && notification.recipient && (
                                <div className="mt-1">
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                                    {notification.recipient.role}
                                  </span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs sm:text-base lg:text-xs mt-4 w-full">
                              {truncateText(notification.body, 80)}
                            </p>
                          </div>
                        </div>
                        <Modal
                          trigger={
                            <Button className="rounded-xl text-blue-600 hover:bg-blue-100 bg-blue-200 py-3 text-xs">
                              View
                            </Button>
                          }
                          title={notification.title}
                          description={""}
                          content={
                            <NotificationOpenModal
                              id={notification.id}
                              body={notification.body}
                              created_at={notification.createdAt}
                              refetch={refetch}
                            />
                          }
                        />
                      </div>
                      <Separator />
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center h-[330px]">
                  <Image
                    src="/nodata.svg"
                    alt="No Data"
                    width={160}
                    height={160}
                  />
                  <h1 className="mt-8 text-lg font-semibold text-center">
                    {role !== "all" 
                      ? `No ${role} notifications available` 
                      : "You are all caught up"}
                  </h1>
                </div>
              )}
              {!isLoading && totalPages > 0 && (
                <div className="pt-10">
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          </TabsContent>
          
          {role === "all" && (
            <>
              <TabsContent value="broadcast" className="mt-10">
                <Broadcast />
              </TabsContent>
              <TabsContent value="announcement" className="mt-10">
                <Announcement />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Notification;