import { IoPersonOutline } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Notification } from "@/constants";
import Logo from "@/public/trubookerNotification.svg";
import Spinner from "./Spinner";
import { useFetchNotificationsQuery } from "@/redux/services/Slices/notificationApiSlice";

const Notifications = () => {
  const router = useRouter();

  const {
    data: unreadData,
    isLoading: unreadLoading,
    isFetching: unreadFetching,
  } = useFetchNotificationsQuery({ type: "unread" });

  const {
    data: readData,
    isLoading: readLoading,
    isFetching: readFetching,
  } = useFetchNotificationsQuery({ type: "read" });

  return (
    // <div className="mb-10 xl:mb-5">
    <div className="">
      <Card className="w-full overflow-y-auto overflow-x-hidden h-[500px]">
        <CardHeader className="sticky pt-5 pb-3 bg-white text-left text-lg font-bold">
          Notifications
        </CardHeader>
        <CardContent>
          {Notification?.length > 0 ? (
            <>
              {Notification?.map((actions: any) => (
                <div key={actions.id}>
                  <Separator />
                  <div className="my-4">
                    <div className="flex w-full items-start space-x-4">
                      <Image
                        src={Logo}
                        width="40"
                        alt="Logo"
                        className=" flex "
                      />
                      <div className="">
                        <p className="text-gray-800 font-medium text-sm flex">
                          {actions.message}
                        </p>
                        <p className="text-xs text-gray-500">{actions.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              {unreadFetching || readFetching ? (
                <div className="h-[390px] w-full">
                  <Spinner />
                </div>
              ) : (
                <div className="flex items-center w-full h-[390px] flex-col justify-center">
                  <Image
                    src={"/nodata.svg"}
                    alt=""
                    width={200}
                    height={200}
                    className="object-cover me-5"
                  />
                  <h1 className="mt-8 text-lg text-center font-semibold">
                    You are all caught up
                  </h1>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
