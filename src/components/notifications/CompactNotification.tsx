"use client";

import React, { useState } from "react";
import { useFetchNotificationsQuery } from "@/redux/services/Slices/notificationApiSlice";
import Spinner from "@/components/Spinner";
import Image from "next/image";
import Logo from "@/public/trubookerNotification.svg";
import { truncateText } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/DualModal";
import NotificationOpenModal from "@/components/notificationOpenModal";
import { BsCheckAll } from "react-icons/bs";
import { MdDeleteForever } from "react-icons/md";
import {
  useMarkAllAsReadMutation,
  useDeleteAllNotificationsMutation,
} from "@/redux/services/Slices/notificationApiSlice";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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

interface CompactNotificationProps {
  role?: "passenger" | "driver" | "agent";
  maxDisplay?: number;
}

const CompactNotification = ({ 
  role = "passenger", 
  maxDisplay = 5 
}: CompactNotificationProps) => {
  const [viewType, setViewType] = useState<"unread" | "read">("unread");
  const router = useRouter();
  
  const { data, isLoading, isFetching, refetch } = useFetchNotificationsQuery({
    type: viewType,
    ...(role && { role }),
  });

  const [markAllAsRead, { isLoading: markAllLoading }] =
    useMarkAllAsReadMutation();
  const [deleteAll, { isLoading: deleteAllLoading }] =
    useDeleteAllNotificationsMutation();

  let notifications: NotificationItem[] = data?.result?.data ?? [];
  
  // Filter by role if needed
  if (role && notifications.length > 0) {
    notifications = notifications.filter(
      (notification) => notification.recipient?.role === role
    );
  }

  const displayNotifications = notifications.slice(0, maxDisplay);
  const hasMore = notifications.length > maxDisplay;

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(null).unwrap();
      toast.success("All notifications marked as read");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error occurred");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAll(null).unwrap();
      toast.success("All notifications deleted");
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Error occurred");
    }
  };

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'passenger': return 'bg-green-100 text-green-700';
      case 'driver': return 'bg-blue-100 text-blue-700';
      case 'agent': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-gray-700">
            {role.charAt(0).toUpperCase() + role.slice(1)} Alerts
          </h4>
          <Badge 
            variant="outline" 
            className="text-xs bg-orange-100 text-orange-600 border-orange-200"
          >
            {notifications.length}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Badge
            onClick={() => setViewType(viewType === "unread" ? "read" : "unread")}
            variant="outline"
            className="cursor-pointer text-xs px-2 py-0.5 bg-[--primary] text-white border-[--primary]"
          >
            {viewType === "unread" ? "Unread" : "Read"}
          </Badge>
        </div>
      </div>

      {/* Notification List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {isFetching ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : displayNotifications.length > 0 ? (
          displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-100' 
                  : 'bg-blue-50 border-blue-100'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <Image src={Logo} width="24" height="24" alt="Logo" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-800 truncate">
                      {notification.title}
                    </p>
                    <Modal
                      trigger={
                        <Button 
                          variant="ghost" 
                          className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
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
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {truncateText(notification.body, 60)}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-gray-400">
                      {new Date(notification.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {notification.recipient && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getRoleColor(notification.recipient.role)}`}>
                        {notification.recipient.role}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center mb-2">
              <Image src="/nodata.svg" alt="No Data" width={60} height={60} />
            </div>
            <p className="text-sm text-gray-500">No {role} notifications</p>
          </div>
        )}

        {hasMore && (
          <div className="text-center pt-2">
            <Button
              variant="link"
              className="text-xs text-[--primary]"
              onClick={() => router.push("/notification")}
            >
              View all {notifications.length} notifications →
            </Button>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-[--primary] hover:text-[--primary] hover:bg-blue-50"
            onClick={handleMarkAllAsRead}
            disabled={markAllLoading}
          >
            <BsCheckAll className="w-4 h-4 mr-1" />
            Mark all read
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleDeleteAll}
            disabled={deleteAllLoading}
          >
            <MdDeleteForever className="w-4 h-4 mr-1" />
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
};

export default CompactNotification;