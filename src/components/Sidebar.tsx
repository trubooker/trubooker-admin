"use client";

import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import { NavLinks } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { CiLogout } from "react-icons/ci";
import LogoutModal from "./LogoutModal";

const Sidebar = () => {
  const pathname = usePathname();
  const [openLog, setOpenLog] = React.useState(false);
  const handleLogout = () => {
    setOpenLog(true);
  };
  return (
    <div className="h-screen z-50 overflow-y-auto flex flex-col justify-between">
      <LogoutModal open={openLog} setOpen={setOpenLog} />
      <div>
        <div className="flex h-auto items-center px-4 lg:h-[90px] z-50 lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="relative w-32 h-32">
              <Image src={"/logo.svg"} className="ms-2" alt="" fill />
            </div>
          </Link>
        </div>

        <div className="flex-1 mt-4">
          {NavLinks.map((navlink, index: number) => (
            <nav
              key={navlink.title}
              className="flex flex-col my-2 items-start text-sm font-medium lg:px-4"
            >
              {!navlink.sublinks ? (
                <Link
                  href={`${navlink.link!}`}
                  className={`${
                    pathname === navlink.link
                      ? " bg-[--primary] hover:bg-[--primary] hover:text-white rounded-[12px] text-white"
                      : "hover:bg-[--primary] text-gray-400 hover:text-white"
                  } transition duration-300 flex items-center w-full gap-3 rounded-lg px-3 py-2`}
                >
                  <dt className="inline ">
                    <navlink.icon aria-hidden="true" className="h-6 w-6" />
                  </dt>
                  <span>{navlink.title}</span>
                </Link>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${index + 1}`} className=" my-2">
                    <AccordionTrigger>
                      <div className="flex items-center gap-3 rounded-lg px-3 text-xs lg:text-sm transition-all text-gray-400">
                        <navlink.icon aria-hidden="true" className="h-6 w-6" />
                        {navlink.title}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="ms-10 flex flex-col mt-3 gap-y-2">
                        {navlink.sublinks!.map((link: any) => (
                          <Link
                            key={link.title}
                            href={link.link}
                            className={`${
                              pathname === link.link
                                ? " bg-[--primary] hover:bg-[--primary] hover:text-white rounded-[12px] text-white"
                                : "hover:bg-[--primary] hover:text-white text-gray-400"
                            } transition duration-300 flex items-center w-full gap-3 rounded-[12px] px-3 py-2`}
                          >
                            <li className="text-[13px] items-center flex gap-x-3">
                              <link.icon
                                aria-hidden="true"
                                className="h-6 w-6"
                              />
                              <span>{link.title}</span>
                            </li>
                          </Link>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
            </nav>
          ))}
        </div>
        <div className="p-1 mb-4 bottom-0 absolute w-full left-0">
          <div
            onClick={handleLogout}
            className={`text-[--danger] font-bold transition duration-300 flex items-center w-full gap-3 rounded-lg px-3 py-2`}
          >
            <dt className="inline ">
              <CiLogout aria-hidden="true" className="h-6 w-6" />
            </dt>
            <span>Logout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
