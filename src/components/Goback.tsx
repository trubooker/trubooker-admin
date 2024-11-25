"use client";
import React, { FC } from "react";
import { useRouter } from "next/navigation";
import { IoChevronBackOutline } from "react-icons/io5";
import Breadcrumbs from "./Breadcrumb";

interface Props {
  formerPage: string;
  presentPage: string;
}
const Goback: FC<Props> = ({ formerPage, presentPage }) => {
  const router = useRouter();

  return (
    <div className="relative">
      <Breadcrumbs
        classname="hidden lg:block"
        content1={formerPage}
        content2={presentPage}
      />
      <button
        onClick={router.back}
        className="lg:hidden text-gray-500 cursor-pointer top-7 left-8 lg:top-2 lg:left-2 z-20 bg-white h-10 w-10 rounded-full flex items-center justify-center shadow-lg"
      >
        <IoChevronBackOutline className="h-6 w-6 text-gray-800" />
      </button>
    </div>
  );
};

export default Goback;
