"use client";

import React from "react";
import { Bell, CircleUser, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HiOutlineLogout } from "react-icons/hi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { NavLinks } from "@/constants";
import { Separator } from "@/components/ui/separator";
import { LuLayoutDashboard } from "react-icons/lu";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import LogoutModal from "./LogoutModal";
import { useLoggedInUser } from "@/hooks/useLoggedUser";

const MobileNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [openLog, setOpenLog] = React.useState(false);
  const handleLogout = () => {
    setOpenLog(true);
  };
  const { isLoading: loading }: any = true;

  const { userData: data, userLoading, userRefetching } = useLoggedInUser();
  return (
    <div className="flex justify-between items-center w-full">
      <LogoutModal open={openLog} setOpen={setOpenLog} />
      <div className="flex items-center gap-x-5">
        <div>
          <Sheet>
            <SheetTrigger asChild>
              <Menu className="h-7 w-7 lg:hidden cursor-pointer" />
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex flex-col gap-y-4">
                <div className="relative w-32 h-10 mb-8">
                  <Image
                    className="sm:mx-0 mt-1 rounded lg:hidden"
                    src={"/logo.svg"}
                    fill
                    alt=""
                  />
                </div>
                <>
                  {NavLinks.map((navlink, index: number) => (
                    <nav
                      key={navlink.title}
                      className="flex flex-col gap-y-3 items-start text-sm font-medium lg:px-4"
                    >
                      {!navlink.sublinks ? (
                        <>
                          <SheetClose className="w-full">
                            <Button
                              variant={"outline"}
                              onClick={() => router.push(navlink.link!)}
                              className={`${
                                pathname === navlink.link
                                  ? " bg-[--primary] hover:bg-[--primary] hover:text-white rounded-[12px] text-white"
                                  : "hover:bg-[--primary] hover:text-white text-gray-400"
                              } transition duration-300 flex items-center w-full gap-3 rounded-lg px-3 py-2 border-none`}
                            >
                              <span className="text-left me-auto flex gap-3">
                                <navlink.icon
                                  aria-hidden="true"
                                  className="h-6 w-6"
                                />

                                {navlink.title}
                              </span>
                            </Button>
                          </SheetClose>
                        </>
                      ) : (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem
                            value={`item-${index + 1}`}
                            className=" transition duration-300 w-full rounded-lg py-2  text-gray-400"
                          >
                            <AccordionTrigger>
                              <div className="flex items-center gap-2 rounded-lg px-3 text-sm transition-all">
                                <navlink.icon
                                  aria-hidden="true"
                                  className="h-5 w-5"
                                />
                                {navlink.title}
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="ms-10 flex mt-3 flex-col gap-y-2">
                                {navlink.sublinks!.map((link: any) => (
                                  <SheetClose
                                    key={link.title}
                                    className="w-full"
                                  >
                                    <Button
                                      variant={"outline"}
                                      onClick={() => router.push(link.link)}
                                      className={`${
                                        pathname === link.link
                                          ? " bg-[--primary] hover:bg-[--primary] hover:text-white rounded-[12px] text-white"
                                          : "hover:bg-[--primary] hover:text-white text-gray-400"
                                      } transition duration-300 flex items-center w-full gap-3 border-none rounded-[12px] px-3 py-2`}
                                    >
                                      <li className="text-left me-auto flex gap-3">
                                        <link.icon
                                          aria-hidden="true"
                                          className="h-6 w-6"
                                        />
                                        <span className="text-sm">
                                          {link.title}
                                        </span>
                                      </li>
                                    </Button>
                                  </SheetClose>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )}
                    </nav>
                  ))}
                </>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex">
        <div className="flex justify-between items-center space-x-5 w-full border border-none ps-4 me-2 text-sm font-medium text-gray-700">
          {loading ? (
            <Skeleton className="h-10 w-32" />
          ) : (
            <>
              <p className="text-sm font-semibold text-black lg:flex flex-col hidden ">
                {/* Hello, {data?.data?.first_name} */}
                <span className="text-lg ">
                  {data?.first_name} {data?.last_name}
                </span>
                <small className="text-xs font-normal">Super Admin</small>
              </p>
              <Avatar className="w-10 h-10">
                <AvatarImage src={data?.profile_picture} />
                <AvatarFallback>
                  {data?.first_name?.charAt(0)}
                  {data?.last_name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </>
          )}
          <Separator orientation="vertical" className="h-10 ms-2 me-1" />
          <HiOutlineLogout
            className="h-9 w-9 text-red-500 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
