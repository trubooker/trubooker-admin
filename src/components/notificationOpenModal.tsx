"use client";

import React, { FC } from "react";
import {
  useDeleteOneNotificationMutation,
  useMarkOneAsReadMutation,
} from "@/redux/services/Slices/notificationApiSlice";
import { MdDeleteForever } from "react-icons/md";
import { BsCheckAll } from "react-icons/bs";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface NotificationOpenModalProps {
  body: string;
  created_at: string;
  id: string;
  refetch: () => void;
}

const NotificationOpenModal: FC<NotificationOpenModalProps> = ({
  body,
  id,
  created_at,
  refetch,
}) => {
  const [deleteOne, { isLoading: deleteOneLoading }] =
    useDeleteOneNotificationMutation();
  const [markOne, { isLoading: markOneLoading }] = useMarkOneAsReadMutation();
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
    <>
      <p className="mt-2 text-sm text-gray-500">{body}</p>
      <p className="mt-4 text-xs text-gray-400">
        {new Date(created_at).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })}
        {/* {new Date(created_at).toLocaleString()} */}
      </p>
      <div className="flex justify-end w-full mt-10">
        <Badge
          onClick={() => handleMarkOne(id)}
          className="cursor-pointer text-[--primary] flex gap-x-1"
        >
          <BsCheckAll className="w-4 h-4" />
          <span>Mark as read</span>
        </Badge>
        <Badge
          onClick={() => handleDeleteOne(id)}
          className="cursor-pointer text-red-500 flex gap-x-1"
        >
          <MdDeleteForever className="w-4 h-4" />
          <span>Delete</span>
        </Badge>
      </div>
    </>
  );
};

export default NotificationOpenModal;
