import React, { ReactNode, useState } from "react";
import { useSwipeable } from "react-swipeable";
import clsx from "clsx";
import { Separator } from "./ui/separator";

const SwipeableNotification: React.FC<{
  id: string;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  content: ReactNode;
}> = ({ id, onMarkAsRead, onDelete, content }) => {
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
          "absolute right-0 top-0 h-full flex flex-col text-xs py-2 text-end  justify-around z-10 transition-transform px-4 ",
          isActionsVisible ? "translate-x-0" : "translate-x-full"
        )}
        style={{ width: "60%" }}
      >
        <button
          className="text-red-600 hover:bg-red-100 bg-red-200 py-4 rounded-xl"
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
        <button
          className="text-green-600 hover:bg-green-100 bg-green-200 py-4 rounded-xl"
          onClick={() => onMarkAsRead(id)}
        >
          Mark as Read
        </button>
      </div>

      {/* Notification Content */}
      <div
        className={clsx(
          "bg-white py-2 transition-transform flex justify-between items-center",
          isActionsVisible && "-translate-x-[60%]"
        )}
      >
        {content}
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
