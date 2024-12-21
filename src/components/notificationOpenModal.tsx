import React, { FC } from "react";

interface NotificationOpenModalProps {
  body: string;
  created_at: string;
}

const NotificationOpenModal: FC<NotificationOpenModalProps> = ({
  body,
  created_at,
}) => {
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
    </>
  );
};

export default NotificationOpenModal;
