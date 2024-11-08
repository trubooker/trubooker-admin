import React from "react";
import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid lg:grid-cols-[280px_1fr] h-full ">
      <div className="hidden lg:block ">
        <div className="sticky bg-white top-0 flex flex-col ">
          <Sidebar />
        </div>
      </div>
      <div className="flex flex-col h-full bg-[#F8F7F7]">
        <header className="sticky bg-white top-0 z-50 flex h-16 items-center gap-4 px-4 lg:h-[60px] lg:px-6">
          <MobileNavbar />
        </header>
        <div className=" w-11/12 mx-auto my-10 ">{children}</div>
      </div>
    </div>
  );
};

export default LayoutWrapper;
