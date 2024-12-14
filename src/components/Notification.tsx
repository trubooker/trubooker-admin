import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";
import { useState } from "react";
import Spinner from "./Spinner";
import Logo from "@/public/trubookerNotification.svg";
import {
  useDeleteAllNotificationsMutation,
  useDeleteOneNotificationMutation,
  useFetchNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkOneAsReadMutation,
} from "@/redux/services/Slices/notificationApiSlice";
import { MdDeleteForever } from "react-icons/md";
import { IoMailUnreadOutline } from "react-icons/io5";
import { GoRead } from "react-icons/go";
import { BsCheckAll } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Notification } from "@/constants";
import SwipeableNotification from "./SwipeableContent";
import { Modal } from "./DualModal";

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
  const [markOne, { isLoading: markOneLoading }] = useMarkOneAsReadMutation();

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

  const handleMarkOne = async (id: string) => {
    try {
      await markOne(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  return (
    <div>
      <div className="">
        <Card className="w-full overflow-y-auto overflow-x-hidden max-h-[500px]">
          <CardHeader className="sticky pt-4 pb-2 px-5 bg-white shadow-lg top-0 z-50 border-b text-left text-lg font-bold flex flex-row justify-between items-start">
            <span>
              Notifications
              <div>
                {viewType === "read" ? (
                  <small>
                    <Badge
                      variant="outline"
                      className="text-[--primary] border-[--primary] mb-1"
                    >
                      Seen
                    </Badge>
                  </small>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-[--primary] border-[--primary] mb-1"
                  >
                    Unread
                  </Badge>
                )}
              </div>
            </span>
            <span>
              {viewType === "read" ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <IoMailUnreadOutline
                        onClick={() => setViewType("unread")}
                        className="text-[--primary] cursor-pointer w-6 h-6 mx-auto"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Unread Messages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <GoRead
                        onClick={() => setViewType("read")}
                        className="text-[--primary] cursor-pointer w-6 h-6 mx-auto"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Read Messages</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </span>
          </CardHeader>

          <CardContent className="py-3 px-2">
            <>
              {Notification?.length > 0 ? (
                <>
                  {Notification?.map((notification: any) => (
                    <SwipeableNotification
                      key={notification.id}
                      id={notification.id}
                      onMarkAsRead={handleMarkOne}
                      onDelete={handleDeleteOne}
                      content={
                        <div className="h-[100px]">
                          <div className="flex w-full items-start h-full space-x-4">
                            <Image
                              src={Logo}
                              width="40"
                              alt="Logo"
                              className=" flex "
                            />
                            <div className="h-full">
                              <p className="text-gray-800 font-medium text-xs flex">
                                {notification.message}
                              </p>
                              <small className="bottom-0 left-0 mt-auto h-full text-gray-500">
                                {notification.date}
                              </small>
                            </div>
                          </div>
                        </div>
                      }
                    />
                  ))}
                </>
              ) : (
                <>
                  {isFetching ? (
                    <div className="h-[330px] w-full">
                      <Spinner />
                    </div>
                  ) : (
                    <div className="flex items-center w-full h-[330px] flex-col justify-center">
                      <Image
                        src={"/nodata.svg"}
                        alt=""
                        width={160}
                        height={160}
                        className="object-cover me-5"
                      />
                      <h1 className="mt-8 text-lg text-center font-semibold">
                        You are all caught up
                      </h1>
                    </div>
                  )}
                </>
              )}
            </>
          </CardContent>
          <CardFooter className="sticky z-50 bottom-0 bg-white shadow-lg border-t px-5 py-3">
            <div className="flex gap-x-2 justify-end ms-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <BsCheckAll
                      onClick={handleMarkAllAsRead}
                      className="text-[--primary] rounded-full cursor-pointer w-10 h-8 mx-auto"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark all Notifications as Read</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <MdDeleteForever
                      onClick={handleDeleteAll}
                      className="text-red-500 rounded-full cursor-pointer w-10 h-8 mx-auto"
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete all Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Notifications;
