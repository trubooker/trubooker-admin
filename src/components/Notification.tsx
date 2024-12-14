import { IoTrashOutline } from "react-icons/io5";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import Spinner from "./Spinner";
import Logo from "@/public/trubookerNotification.svg";
import {
  useDeleteAllNotificationsMutation,
  useDeleteOneNotificationMutation,
  useFetchNotificationsQuery,
  useMarkAllAsReadMutation,
} from "@/redux/services/Slices/notificationApiSlice";

const Notifications = () => {
  const [viewType, setViewType] = useState<"unread" | "read">("unread");
  const { data, isLoading, isFetching } = useFetchNotificationsQuery({
    type: viewType,
  });

  const [markAllAsRead, { isLoading: markAllLoading }] =
    useMarkAllAsReadMutation();
  const [deleteAll, { isLoading: deleteAllLoading }] =
    useDeleteAllNotificationsMutation();
  const [deleteOne, { isLoading: deleteOneLoading }] =
    useDeleteOneNotificationMutation();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(null);
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAll(null);
    } catch (error) {
      console.error("Failed to delete all notifications:", error);
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await deleteOne(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div>
      <Card className="w-full overflow-y-auto h-[500px]">
        <CardHeader className="sticky pt-5 pb-3 bg-white text-left text-lg font-bold flex justify-between items-center">
          <span>Notifications</span>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || isFetching || deleteAllLoading}
              onClick={() => setViewType("unread")}
            >
              Unread
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading || isFetching || deleteAllLoading}
              onClick={() => setViewType("read")}
            >
              Read
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteAllLoading}
              onClick={handleDeleteAll}
            >
              Delete All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isFetching || isLoading ? (
            <div className="h-[390px] w-full flex justify-center items-center">
              <Spinner />
            </div>
          ) : data?.length > 0 ? (
            <>
              {data.map((notification: any) => (
                <div key={notification.id}>
                  <Separator />
                  <div className="my-4 flex justify-between items-start">
                    <div className="flex items-start space-x-4">
                      <Image
                        src={Logo}
                        width={40}
                        alt="Logo"
                        className="flex"
                      />
                      <div>
                        <p className="text-gray-800 font-medium text-sm">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {notification.date}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={deleteOneLoading}
                      onClick={() => handleDeleteOne(notification.id)}
                    >
                      <IoTrashOutline size={20} />
                    </Button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[390px]">
              <Image
                src="/nodata.svg"
                alt="No data"
                width={200}
                height={200}
                className="object-cover"
              />
              <h1 className="mt-8 text-lg font-semibold">
                You are all caught up
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
