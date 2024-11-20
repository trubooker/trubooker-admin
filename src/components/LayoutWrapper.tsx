"use client";

import React from "react";
import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";
import useAuthCheck from "@/hooks/useAuthCheck";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  useAuthCheck();
  return (
    <div className="grid lg:grid-cols-[280px_1fr] h-screen">
      <div className="hidden lg:block ">
        <div className="sticky bg-white top-0 flex flex-col ">
          <Sidebar />
        </div>
      </div>
      <main className="w-full relative overflow-y-auto bg-[#F8F7F7]">
        <header className="sticky bg-white top-0 z-50 flex px-4 lg:h-20 h-[8vh] items-center gap-4">
          <MobileNavbar />
        </header>
        <div className="w-11/12 mx-auto my-10 ">{children}</div>
      </main>
    </div>
  );
};

export default LayoutWrapper;
