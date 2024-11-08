import { RxDashboard } from "react-icons/rx";
import { TbReportSearch } from "react-icons/tb";
import { IoCarOutline } from "react-icons/io5";
import { CiFlag1 } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { LuCircleDollarSign } from "react-icons/lu";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TbUserStar } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { LinkItem } from "@/types";

export const NavLinks: LinkItem[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: RxDashboard,
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Passengers",
    icon: HiOutlineUserGroup,
    link: "/passengers",
  },
  {
    id: 3,
    title: "Drivers",
    icon: IoCarOutline,
    link: "/drivers",
  },
  {
    id: 4,
    title: "Agent",
    icon: TbUserStar,
    link: "/agent",
  },
  {
    id: 5,
    title: "Finance",
    icon: LuCircleDollarSign,
    link: "/finance",
  },
  {
    id: 6,
    title: "Notification",
    icon: MdOutlineNotificationsActive,
    link: "/notification",
  },
  {
    id: 7,
    title: "Settings",
    icon: IoSettingsOutline,
    sublinks: [
      {
        id: 1,
        title: "Basic Settings",
        icon: CiFlag1,
        link: "/settings",
      },
      {
        id: 2,
        title: "Roles & permission",
        icon: CiFlag1,
        link: "/settings/roles",
      },
      {
        id: 3,
        title: "Referral program",
        icon: CiFlag1,
        link: "/settings/referral-program",
      },
      {
        id: 4,
        title: "Platform settings",
        icon: CiFlag1,
        link: "/settings/platform",
      },
    ],
  },
  {
    id: 8,
    title: "Report",
    icon: MdErrorOutline,
    link: "/report",
  },
];
