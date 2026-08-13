import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import Spinner from "./Spinner";
import {
  useDeleteAllNotificationsMutation,
  useDeleteOneNotificationMutation,
  useFetchNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkOneAsReadMutation,
} from "@/redux/services/Slices/notificationApiSlice";
import { MdDeleteForever } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import SwipeableNotification from "./SwipeableContent";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  recipient: {
    id: string;
    name: string;
    email?: string;
    role: string;
  } | null;
}

const Notifications = () => {
  const [viewType, setViewType] = useState<"unread" | "read">("unread");
  
  console.log("🔔 Notifications component rendered");
  console.log("📋 Current viewType:", viewType);
  
  const { data, isLoading, isFetching, refetch } = useFetchNotificationsQuery({
    type: viewType,
  });
  
  console.log("📡 Fetch query state:", { data, isLoading, isFetching });
  console.log("📦 Raw data received:", data);
  
  const router = useRouter();
  const notifications: NotificationItem[] = data?.result?.data || [];
  
  console.log("📨 Processed notifications:", notifications);
  console.log("🔢 Total notifications count:", notifications.length);

  const displayNotifications = notifications.slice(0, 5);
  
  console.log("👀 Display notifications (first 5):", displayNotifications);

  const [markAllAsRead, { isLoading: markAllLoading }] =
    useMarkAllAsReadMutation();
  const [deleteAll, { isLoading: deleteAllLoading }] =
    useDeleteAllNotificationsMutation();
  const [deleteOne, { isLoading: deleteOneLoading }] =
    useDeleteOneNotificationMutation();
  const [markOne, { isLoading: markOneLoading }] = useMarkOneAsReadMutation();

  console.log("🔄 Mutation states:", { 
    markAllLoading, 
    deleteAllLoading, 
    deleteOneLoading, 
    markOneLoading 
  });

  const handleMarkAllAsRead = async () => {
    console.log("📌 handleMarkAllAsRead triggered");
    try {
      console.log("⏳ Marking all as read...");
      await markAllAsRead(null).unwrap();
      console.log("✅ All notifications marked as read successfully");
      toast.success("All notifications marked as read");
      refetch();
      console.log("🔄 Refetching notifications...");
    } catch (error) {
      console.error("❌ Error in handleMarkAllAsRead:", error);
      toast.error("Error occurred");
    }
  };

  const handleDeleteAll = async () => {
    console.log("🗑️ handleDeleteAll triggered");
    try {
      console.log("⏳ Deleting all notifications...");
      await deleteAll(null).unwrap();
      console.log("✅ All notifications deleted successfully");
      toast.success("All notifications deleted");
      refetch();
      console.log("🔄 Refetching notifications...");
    } catch (error) {
      console.error("❌ Error in handleDeleteAll:", error);
      toast.error("Error occurred");
    }
  };

  const handleDeleteOne = async (id: string) => {
    console.log(`🗑️ handleDeleteOne triggered for notification ID: ${id}`);
    try {
      console.log(`⏳ Deleting notification with ID: ${id}...`);
      await deleteOne(id).unwrap();
      console.log(`✅ Notification ${id} deleted successfully`);
      toast.success("Deleted Successfully");
      refetch();
      console.log("🔄 Refetching notifications...");
    } catch (error) {
      console.error(`❌ Error deleting notification ${id}:`, error);
      toast.error("Error occurred");
    }
  };

  const handleMarkOne = async (id: string) => {
    console.log(`📌 handleMarkOne triggered for notification ID: ${id}`);
    try {
      console.log(`⏳ Marking notification ${id} as read...`);
      await markOne(id).unwrap();
      console.log(`✅ Notification ${id} marked as read successfully`);
      toast.success("Success");
      refetch();
      console.log("🔄 Refetching notifications...");
    } catch (error) {
      console.error(`❌ Error marking notification ${id} as read:`, error);
      toast.error("Error occurred");
    }
  };

  const handleViewTypeToggle = () => {
    const newViewType = viewType === "unread" ? "read" : "unread";
    console.log(`🔄 Toggling viewType from "${viewType}" to "${newViewType}"`);
    setViewType(newViewType);
  };

  const handleViewAll = () => {
    console.log("👆 View All button clicked, navigating to /notification");
    router.push("/notification");
  };

  console.log("🎨 Rendering UI with state:", {
    viewType,
    notificationsCount: notifications.length,
    displayCount: displayNotifications.length,
    isFetching,
    isLoading
  });

  return (
    <div>
      <Card className="w-full overflow-y-auto overflow-x-hidden max-h-[500px]">
        <CardHeader className="sticky top-0 z-30 bg-white shadow-lg border-b py-4 px-5 text-lg font-bold">
          <div className="flex justify-between">
            Notifications
            <Badge
              onClick={handleViewTypeToggle}
              variant="outline"
              className="cursor-pointer text-white bg-[--primary] border-[--primary] rounded-xl"
            >
              {viewType === "unread" ? "Unread" : "Read"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="py-3 px-2 min-h-[390px]">
          {isFetching ? (
            <Spinner />
          ) : displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => {
              console.log(`📋 Rendering notification:`, {
                id: notification.id,
                title: notification.title,
                isRead: notification.isRead,
                type: notification.type
              });
              return (
                <SwipeableNotification
                  refetch={refetch}
                  key={notification.id}
                  index={notification.id}
                  onMarkAsRead={handleMarkOne}
                  onDelete={handleDeleteOne}
                  content={notification}
                  deleteOneLoading={deleteOneLoading}
                  markOneLoading={markOneLoading}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center h-[330px]">
              <Image src="/nodata.svg" alt="No Data" width={160} height={160} />
              <h1 className="mt-8 text-lg font-semibold text-center">
                You are all caught up
              </h1>
            </div>
          )}
          {notifications.length > 5 && (
            <div className="mt-4 text-center">
              <button
                onClick={handleViewAll}
                className="text-[--primary] underline cursor-pointer"
              >
                View All
              </button>
            </div>
          )}
        </CardContent>
        <CardFooter className="sticky bottom-0 z-30 bg-white border-t px-5 py-3">
          <div className="flex justify-between w-full">
            <Badge
              onClick={handleMarkAllAsRead}
              className="cursor-pointer text-[--primary] flex gap-x-1"
            >
              <BsCheckAll className="w-4 h-4" />
              <span>Mark all as read</span>
            </Badge>
            <Badge
              onClick={handleDeleteAll}
              className="cursor-pointer text-red-500 flex gap-x-1"
            >
              <MdDeleteForever className="w-4 h-4" />
              <span>Delete all</span>
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Notifications;