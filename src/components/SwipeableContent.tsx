import React, { ReactNode, useState } from "react";
import { useSwipeable } from "react-swipeable";
import clsx from "clsx";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Modal } from "./DualModal";
import Logo from "@/public/trubookerNotification.svg";
import Image from "next/image";
import { truncateText } from "@/lib/utils";
import NotificationOpenModal from "./notificationOpenModal";
import { FaSpinner } from "react-icons/fa6";

const SwipeableNotification: React.FC<{
  index: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  deleteOneLoading: boolean;
  markOneLoading: boolean;
  refetch: () => void;
  content: {
    title: string;
    body: string;
    created_at: string;
  };
}> = ({
  index,
  onMarkAsRead,
  onDelete,
  content,
  refetch,
  deleteOneLoading,
  markOneLoading,
}) => {
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const handlers = useSwipeable({
    onSwipedLeft: () => setIsActionsVisible(true),
    onSwipedRight: () => setIsActionsVisible(false),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const toggleActions = () => setIsActionsVisible((prev) => !prev);

  return (
    <div className="relative" {...handlers}>
      {/* Action Buttons */}
      <div
        className={clsx(
          "absolute right-0 top-0 h-full flex flex-col text-xs py-2 text-end gap-y-2 justify-center z-10 transition-transform ps-4 ",
          isActionsVisible ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: "40%" }}
      >
        <Button
          className="rounded-xl text-red-600 hover:bg-red-100 bg-red-200 py-2 text-xs"
          disabled={deleteOneLoading}
          onClick={() => onDelete(index)}
        >
          {deleteOneLoading ? (
            <FaSpinner
              className="animate-spin w-4 h-4 text-gray-500 mx-auto"
              size={24}
            />
          ) : (
            "Delete"
          )}
        </Button>
        <Modal
          trigger={
            <Button className="rounded-xl text-blue-600 hover:bg-blue-100 bg-blue-200 py-2 text-xs">
              Open
            </Button>
          }
          title={content?.title}
          description={""}
          content={
            <NotificationOpenModal
              id={index}
              body={content?.body}
              refetch={refetch}
              created_at={content?.created_at}
            />
          }
        />

        <Button
          className="rounded-xl text-green-600 hover:bg-green-100 bg-green-200 py-2 text-xs"
          disabled={markOneLoading}
          onClick={() => onMarkAsRead(index)}
        >
          {markOneLoading ? (
            <FaSpinner
              className="animate-spin w-4 h-4 text-gray-500 mx-auto"
              size={24}
            />
          ) : (
            "Mark as Read"
          )}{" "}
        </Button>
      </div>

      {/* Notification Content */}
      <div
        className={clsx(
          "bg-white py-2 transition-transform flex justify-between items-center",
          isActionsVisible && "-translate-x-[40%]"
        )}
      >
        <div className="">
          <div className="flex w-full  items-start space-x-4">
            <Image src={Logo} width="40" alt="Logo" className=" flex " />
            <div className=" flex flex-col h-auto min-h-[130px]">
              <div>
                <p className="text-gray-800 font-semibold text-sm">
                  {content?.title}
                </p>
                <small className="my-5 text-[11px] text-gray-500">
                  {new Date(content?.created_at).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </small>
              </div>
              <p className="text-xs sm:text-base lg:text-xs mt-4 w-full">
                {truncateText(content?.body, 80)}
              </p>
            </div>
          </div>
        </div>
        <button
          className="text-gray-500 ps-5 pe-2 text-[11px] ms-auto hover:text-gray-700"
          onClick={toggleActions}
        >
          {!isActionsVisible ? "← swipe" : "swipe →"}
        </button>
      </div>
      <Separator />
    </div>
  );
};

export default SwipeableNotification;
