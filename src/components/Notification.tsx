// import {
//   Card,
//   CardHeader,
//   CardContent,
//   CardFooter,
// } from "@/components/ui/card";
// import Image from "next/image";
// import { useState } from "react";
// import Spinner from "./Spinner";
// import {
//   useDeleteAllNotificationsMutation,
//   useDeleteOneNotificationMutation,
//   useFetchNotificationsQuery,
//   useMarkAllAsReadMutation,
//   useMarkOneAsReadMutation,
// } from "@/redux/services/Slices/notificationApiSlice";
// import { MdDeleteForever } from "react-icons/md";
// import { BsCheckAll } from "react-icons/bs";
// import { Badge } from "@/components/ui/badge";
// import { notification } from "@/constants";
// import SwipeableNotification from "./SwipeableContent";
// import { truncateText } from "@/lib/utils";
// import toast from "react-hot-toast";

// const Notifications = () => {
//   const [viewType, setViewType] = useState<"unread" | "read">("unread");
//   const { data, isLoading, isFetching, refetch } = useFetchNotificationsQuery({
//     type: viewType,
//   });
//   // const notification = data?.data;

//   const [markAllAsRead, { isLoading: markAllLoading }] =
//     useMarkAllAsReadMutation();
//   const [deleteAll, { isLoading: deleteAllLoading }] =
//     useDeleteAllNotificationsMutation();
//   const [deleteOne, { isLoading: deleteOneLoading }] =
//     useDeleteOneNotificationMutation();
//   const [markOne, { isLoading: markOneLoading }] = useMarkOneAsReadMutation();

//   const handleMarkAllAsRead = async () => {
//     try {
//       await markAllAsRead(null)
//         .unwrap()
//         .then((res) => {
//           toast.success(res?.message);
//           refetch();
//         });
//     } catch (error) {
//       console.error("Failed to mark all notifications as read:", error);
//     }
//   };

//   const handleDeleteAll = async () => {
//     try {
//       await deleteAll(null)
//         .unwrap()
//         .then((res) => {
//           toast.success(res?.message);
//           refetch();
//         });
//     } catch (error) {
//       console.error("Failed to delete all notifications:", error);
//     }
//   };

//   const handleDeleteOne = async (id: string) => {
//     try {
//       await deleteOne(id)
//         .unwrap()
//         .then((res) => {
//           toast.success("Deleted Successfully");
//           refetch();
//         });
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//       toast.error("Error occured");
//     }
//   };

//   const handleMarkOne = async (id: string) => {
//     try {
//       await markOne(id)
//         .unwrap()
//         .then((res) => {
//           toast.success("Success");
//           refetch();
//         });
//     } catch (error) {
//       console.error("Failed to delete notification:", error);
//       toast.error("Error occured");
//     }
//   };

//   return (
//     <div>
//       <div className="">
//         <Card className="w-full overflow-y-auto overflow-x-hidden max-h-[500px]">
//           <CardHeader className="sticky pt-4 pb-2 px-5 bg-white shadow-lg top-0 z-30 border-b text-left text-lg font-bold ">
//             <span className="flex flex-row justify-between items-start">
//               Notifications
//               <div>
//                 <>
//                   {viewType === "unread" ? (
//                     <Badge
//                       onClick={() => setViewType("read")}
//                       variant="outline"
//                       className="cursor-pointer text-[white] bg-[--primary] border-[--primary] rounded-xl mb-1"
//                     >
//                       Unread
//                     </Badge>
//                   ) : (
//                     <Badge
//                       onClick={() => setViewType("unread")}
//                       variant="outline"
//                       className="cursor-pointer text-[--primary] border-[--primary] rounded-xl mb-1"
//                     >
//                       Read
//                     </Badge>
//                   )}
//                 </>
//               </div>
//             </span>
//           </CardHeader>
//           <CardContent className="py-3 px-2 min-h-[390px]">
//             <>
//               {notification?.length > 0 ? (
//                 <>
//                   {notification?.map((notification: any) => (
//                     <SwipeableNotification
//                       key={notification?.id}
//                       index={notification?.id}
//                       onMarkAsRead={handleMarkOne}
//                       onDelete={handleDeleteOne}
//                       content={notification}
//                       deleteOneLoading={deleteOneLoading}
//                       markOneLoading={markOneLoading}
//                     />
//                   ))}
//                 </>
//               ) : (
//                 <>
//                   {isFetching ? (
//                     <div className="h-[330px] w-full">
//                       <Spinner />
//                     </div>
//                   ) : (
//                     <div className="flex items-center w-full h-[330px] flex-col justify-center">
//                       <Image
//                         src={"/nodata.svg"}
//                         alt=""
//                         width={160}
//                         height={160}
//                         className="object-cover me-5"
//                       />
//                       <h1 className="mt-8 text-lg text-center font-semibold">
//                         You are all caught up
//                       </h1>
//                     </div>
//                   )}
//                 </>
//               )}
//             </>
//           </CardContent>
//           {notification?.length > 0 ? (
//             <>
//               <CardFooter className="sticky z-30 bottom-0 bg-white border-t px-5 py-3">
//                 <div className="flex justify-between w-full">
//                   <Badge
//                     className="cursor-pointer text-[--primary] shadow-none flex gap-x-1"
//                     onClick={handleMarkAllAsRead}
//                   >
//                     <BsCheckAll className="w-4 h-4" />
//                     <span>Mark all as read</span>
//                   </Badge>

//                   <Badge
//                     className="cursor-pointer text-red-500 shadow-none flex gap-x-1"
//                     onClick={handleDeleteAll}
//                   >
//                     <MdDeleteForever className="w-4 h-4" />
//                     <span>Delete all</span>
//                   </Badge>
//                 </div>
//               </CardFooter>
//             </>
//           ) : (
//             ""
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Notifications;

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
// import { notification as mockNotifications } from "@/constants";
import SwipeableNotification from "./SwipeableContent";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Notifications = () => {
  const [viewType, setViewType] = useState<"unread" | "read">("unread");
  const { data, isLoading, isFetching, refetch } = useFetchNotificationsQuery({
    type: viewType,
  });
  const router = useRouter();
  const notifications = data?.data || [];

  // const notifications = mockNotifications || []; // Replace mockNotifications with API data if available
  const displayNotifications = notifications.slice(0, 5);

  const [markAllAsRead, { isLoading: markAllLoading }] =
    useMarkAllAsReadMutation();
  const [deleteAll, { isLoading: deleteAllLoading }] =
    useDeleteAllNotificationsMutation();
  const [deleteOne, { isLoading: deleteOneLoading }] =
    useDeleteOneNotificationMutation();
  const [markOne, { isLoading: markOneLoading }] = useMarkOneAsReadMutation();

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead(null).unwrap();
      toast.success("All notifications marked as read");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAll(null).unwrap();
      toast.success("All notifications deleted");
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteOne = async (id: string) => {
    try {
      await deleteOne(id)
        .unwrap()
        .then((res) => {
          toast.success("Deleted Successfully");
          refetch();
        });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Error occured");
    }
  };

  const handleMarkOne = async (id: string) => {
    try {
      await markOne(id)
        .unwrap()
        .then((res) => {
          toast.success("Success");
          refetch();
        });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      toast.error("Error occured");
    }
  };

  return (
    <div>
      <Card className="w-full overflow-y-auto overflow-x-hidden max-h-[500px]">
        <CardHeader className="sticky top-0 z-30 bg-white shadow-lg border-b py-4 px-5 text-lg font-bold">
          <div className="flex justify-between">
            Notifications
            <Badge
              onClick={() =>
                setViewType(viewType === "unread" ? "read" : "unread")
              }
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
            displayNotifications.map((notification: any) => (
              <SwipeableNotification
                refetch={refetch}
                key={notification?.id}
                index={notification?.id}
                onMarkAsRead={handleMarkOne}
                onDelete={handleDeleteOne}
                content={notification}
                deleteOneLoading={deleteOneLoading}
                markOneLoading={markOneLoading}
              />
            ))
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
                onClick={() => router.push("/notification")}
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
