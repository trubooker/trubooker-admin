import React, { FC } from "react";

interface NotificationOpenModalProps {
  title: string;
  body: string;
  created_at: string;
}

const NotificationOpenModal: FC<NotificationOpenModalProps> = ({
  body,
  created_at,
  title,
}) => {
  return (
    <>
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="mt-2 text-sm text-gray-500">{body}</p>
      <p className="mt-4 text-xs text-gray-400">
        {created_at}
        {/* {new Date(created_at).toLocaleString()} */}
      </p>
    </>
  );
};

export default NotificationOpenModal;
