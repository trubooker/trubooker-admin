import { CiHeart } from "react-icons/ci";
import { PiStudent } from "react-icons/pi";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { CgLogOut } from "react-icons/cg";
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
      // {
      //   id: 4,
      //   title: "Platform settings",
      //   icon: CiFlag1,
      //   link: "/settings/platform",
      // },
    ],
  },
  // {
  //   id: 7,
  //   title: "Notification",
  //   icon: MdOutlineNotificationsActive,
  //   link: "/notification",
  // },
  // {
  //   id: 8,
  //   title: "Report",
  //   icon: MdErrorOutline,
  //   link: "/report",
  // },
];

export interface Country {
  name: string;
  telCode: string;
  flag: string;
}

export interface State {
  name: string;
  telCode: string;
}

export const links: LinkItem[] = [
  {
    id: 1,
    title: "Dashboard",
    icon: RxDashboard,
    link: "/dashboard",
  },
  {
    id: 2,
    title: "Help & Support",
    icon: IoIosHelpCircleOutline,
    link: "/help",
  },
  {
    id: 3,
    title: "Logout",
    icon: CgLogOut,
    link: "/logout",
  },
];

export const states: State[] = [
  { name: "Abia", telCode: "+234" },
  { name: "Adamawa", telCode: "+234" },
  { name: "Akwa Ibom", telCode: "+234" },
  { name: "Anambra", telCode: "+234" },
  { name: "Bauchi", telCode: "+234" },
  { name: "Bayelsa", telCode: "+234" },
  { name: "Benue", telCode: "+234" },
  { name: "Borno", telCode: "+234" },
  { name: "Cross River", telCode: "+234" },
  { name: "Delta", telCode: "+234" },
  { name: "Ebonyi", telCode: "+234" },
  { name: "Edo", telCode: "+234" },
  { name: "Ekiti", telCode: "+234" },
  { name: "Enugu", telCode: "+234" },
  { name: "Gombe", telCode: "+234" },
  { name: "Imo", telCode: "+234" },
  { name: "Jigawa", telCode: "+234" },
  { name: "Kaduna", telCode: "+234" },
  { name: "Kano", telCode: "+234" },
  { name: "Katsina", telCode: "+234" },
  { name: "Kebbi", telCode: "+234" },
  { name: "Kogi", telCode: "+234" },
  { name: "Kwara", telCode: "+234" },
  { name: "Lagos", telCode: "+234" },
  { name: "Nasarawa", telCode: "+234" },
  { name: "Niger", telCode: "+234" },
  { name: "Ogun", telCode: "+234" },
  { name: "Ondo", telCode: "+234" },
  { name: "Osun", telCode: "+234" },
  { name: "Oyo", telCode: "+234" },
  { name: "Plateau", telCode: "+234" },
  { name: "Rivers", telCode: "+234" },
  { name: "Sokoto", telCode: "+234" },
  { name: "Taraba", telCode: "+234" },
  { name: "Yobe", telCode: "+234" },
  { name: "Zamfara", telCode: "+234" },
];

export const countries: Country[] = [
  {
    name: "Kenya",
    telCode: "+254",
    flag: "https://flagcdn.com/ke.svg",
  },
  {
    name: "Ghana",
    telCode: "+233",
    flag: "https://flagcdn.com/gh.svg",
  },
  {
    name: "Nigeria",
    telCode: "+234",
    flag: "https://flagcdn.com/ng.svg",
  },
  {
    name: "Egypt",
    telCode: "+20",
    flag: "https://flagcdn.com/eg.svg",
  },
  {
    name: "United States",
    telCode: "+1",
    flag: "https://flagcdn.com/us.svg",
  },
  {
    name: "South Africa",
    telCode: "+27",
    flag: "https://flagcdn.com/za.svg",
  },
  {
    name: "Algeria",
    telCode: "+213",
    flag: "https://flagcdn.com/dz.svg",
  },
  {
    name: "Angola",
    telCode: "+244",
    flag: "https://flagcdn.com/ao.svg",
  },
  {
    name: "Benin",
    telCode: "+229",
    flag: "https://flagcdn.com/bj.svg",
  },
  {
    name: "Botswana",
    telCode: "+267",
    flag: "https://flagcdn.com/bw.svg",
  },
  {
    name: "Burkina Faso",
    telCode: "+226",
    flag: "https://flagcdn.com/bf.svg",
  },
  {
    name: "Burundi",
    telCode: "+257",
    flag: "https://flagcdn.com/bi.svg",
  },
  {
    name: "Cameroon",
    telCode: "+237",
    flag: "https://flagcdn.com/cm.svg",
  },
  {
    name: "Cape Verde",
    telCode: "+238",
    flag: "https://flagcdn.com/cv.svg",
  },
  {
    name: "Central African Republic",
    telCode: "+236",
    flag: "https://flagcdn.com/cf.svg",
  },
  {
    name: "Chad",
    telCode: "+235",
    flag: "https://flagcdn.com/td.svg",
  },
  {
    name: "Comoros",
    telCode: "+269",
    flag: "https://flagcdn.com/km.svg",
  },
  {
    name: "Congo (Brazzaville)",
    telCode: "+242",
    flag: "https://flagcdn.com/cg.svg",
  },
  {
    name: "Congo (Kinshasa)",
    telCode: "+243",
    flag: "https://flagcdn.com/cd.svg",
  },
  {
    name: "Djibouti",
    telCode: "+253",
    flag: "https://flagcdn.com/dj.svg",
  },
  {
    name: "Equatorial Guinea",
    telCode: "+240",
    flag: "https://flagcdn.com/gq.svg",
  },
  {
    name: "Eritrea",
    telCode: "+291",
    flag: "https://flagcdn.com/er.svg",
  },
  {
    name: "Eswatini",
    telCode: "+268",
    flag: "https://flagcdn.com/sz.svg",
  },
  {
    name: "Ethiopia",
    telCode: "+251",
    flag: "https://flagcdn.com/et.svg",
  },
  {
    name: "Gabon",
    telCode: "+241",
    flag: "https://flagcdn.com/ga.svg",
  },
  {
    name: "Gambia",
    telCode: "+220",
    flag: "https://flagcdn.com/gm.svg",
  },
  {
    name: "Guinea",
    telCode: "+224",
    flag: "https://flagcdn.com/gn.svg",
  },
  {
    name: "Guinea-Bissau",
    telCode: "+245",
    flag: "https://flagcdn.com/gw.svg",
  },
  {
    name: "Ivory Coast",
    telCode: "+225",
    flag: "https://flagcdn.com/ci.svg",
  },
  {
    name: "Lesotho",
    telCode: "+266",
    flag: "https://flagcdn.com/ls.svg",
  },
  {
    name: "Liberia",
    telCode: "+231",
    flag: "https://flagcdn.com/lr.svg",
  },
  {
    name: "Libya",
    telCode: "+218",
    flag: "https://flagcdn.com/ly.svg",
  },
  {
    name: "Madagascar",
    telCode: "+261",
    flag: "https://flagcdn.com/mg.svg",
  },
  {
    name: "Malawi",
    telCode: "+265",
    flag: "https://flagcdn.com/mw.svg",
  },
  {
    name: "Mali",
    telCode: "+223",
    flag: "https://flagcdn.com/ml.svg",
  },
  {
    name: "Mauritania",
    telCode: "+222",
    flag: "https://flagcdn.com/mr.svg",
  },
  {
    name: "Mauritius",
    telCode: "+230",
    flag: "https://flagcdn.com/mu.svg",
  },
  {
    name: "Morocco",
    telCode: "+212",
    flag: "https://flagcdn.com/ma.svg",
  },
  {
    name: "Mozambique",
    telCode: "+258",
    flag: "https://flagcdn.com/mz.svg",
  },
  {
    name: "Namibia",
    telCode: "+264",
    flag: "https://flagcdn.com/na.svg",
  },
  {
    name: "Niger",
    telCode: "+227",
    flag: "https://flagcdn.com/ne.svg",
  },
  {
    name: "Rwanda",
    telCode: "+250",
    flag: "https://flagcdn.com/rw.svg",
  },
  {
    name: "Sao Tome and Principe",
    telCode: "+239",
    flag: "https://flagcdn.com/st.svg",
  },
  {
    name: "Senegal",
    telCode: "+221",
    flag: "https://flagcdn.com/sn.svg",
  },
  {
    name: "Seychelles",
    telCode: "+248",
    flag: "https://flagcdn.com/sc.svg",
  },
  {
    name: "Sierra Leone",
    telCode: "+232",
    flag: "https://flagcdn.com/sl.svg",
  },
  {
    name: "Somalia",
    telCode: "+252",
    flag: "https://flagcdn.com/so.svg",
  },
  {
    name: "South Sudan",
    telCode: "+211",
    flag: "https://flagcdn.com/ss.svg",
  },
  {
    name: "Sudan",
    telCode: "+249",
    flag: "https://flagcdn.com/sd.svg",
  },
  {
    name: "Tanzania",
    telCode: "+255",
    flag: "https://flagcdn.com/tz.svg",
  },
  {
    name: "Togo",
    telCode: "+228",
    flag: "https://flagcdn.com/tg.svg",
  },
  {
    name: "Tunisia",
    telCode: "+216",
    flag: "https://flagcdn.com/tn.svg",
  },
  {
    name: "Uganda",
    telCode: "+256",
    flag: "https://flagcdn.com/ug.svg",
  },
  {
    name: "Zambia",
    telCode: "+260",
    flag: "https://flagcdn.com/zm.svg",
  },
  {
    name: "Zimbabwe",
    telCode: "+263",
    flag: "https://flagcdn.com/zw.svg",
  },
];

export const Notification = [
  // {
  //   index: "1",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "2",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "3",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "4",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "5",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "6",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "7",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "8",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "9",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "10",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "11",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "12",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "13",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "14",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "15",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "16",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "17",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "18",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "19",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
  // {
  //   index: "20",
  //   image:
  //     "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
  //   message: "Sandy Jay requested access the admin dashboard as an admin",
  //   date: "59 minutes ago",
  // },
];

export const PassengerFeedback = [
  {
    index: "1",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "2",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "3",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "4",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "5",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "6",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "7",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "8",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "9",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "10",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "11",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "12",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "13",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "14",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "15",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "16",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "17",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "18",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "19",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
  {
    index: "20",
    image:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    message:
      "John Doe is an experienced driver with over 10 years in the transportation industry.",
    email: "michaelade@gmail.com",
    name: "Michael Adebayo",
    date: "59 minutes ago",
    rating: 5,
  },
];

export const Referall = [
  {
    // id: 1,
    name: "Jane Smith",
    status: "5",
  },
  {
    // id: 2,
    name: "Adebayo Grace",
    status: "9",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
  {
    // id: 3,
    name: "John Doe",
    status: "Pending",
  },
];

export const chartDataLine = [
  { month: "Jan", revenue: 0.6 },
  { month: "Feb", revenue: 0.6 },
  { month: "March", revenue: 0.6 },
  { month: "April", revenue: 0.6 },
  { month: "May", revenue: 0.6 },
  { month: "June", revenue: 0.6 },
  { month: "July", revenue: 0.6 },
  { month: "Aug", revenue: 0.9 },
  { month: "Sept", revenue: 0.6 },
  { month: "Oct", revenue: 0.6 },
  { month: "Nov", revenue: 0.6 },
  { month: "Dec", revenue: 0.6 },
];

export const chartConfigLine = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
};

export const FinanceListData = [
  {
    id: "1",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "paid",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "paid",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "paid",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "paid",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "failed",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    email: "oliviarh@gmail.com",
    role: "agent",
    earnings: 5000,
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    status: "failed",
  },
];

export const SettingsListData = [
  {
    id: "1",
    name: "Thelma Ojo",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Wuse Abuja Bus Station",
    arrival: "Kogi Bus station",
    status: "completed",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Wuse Abuja Bus Station",
    arrival: "Kogi Bus station",
    status: "completed",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Wuse Abuja Bus Station",
    arrival: "Kogi Bus station",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Wuse Abuja Bus Station",
    arrival: "Kogi Bus station",
    status: "completed",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Kogi Bus station",
    arrival: "Wuse Abuja Bus Station",
    status: "completed",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Kogi Bus station",
    arrival: "Wuse Abuja Bus Station",
    status: "completed",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    created_at: "Aug 29, 2024",
    departure: "Kogi Bus station",
    arrival: "Wuse Abuja Bus Station",
    status: "completed",
  },
];

export const ReferralProgramListData = [
  {
    id: "1",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",

    referrals: 8,
    target_referrals: 10,
    coupon: 5000,
  },
];

export const PassengerListData = [
  {
    id: "1",
    name: "Thelma Ojo",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "suspended",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
];

export const roles = [
  {
    id: "1",
    users: 5,
    role: "Manager",
    images: [
      {
        profile_image:
          "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-old-school-159613.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1573424/pexels-photo-1573424.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1045298/pexels-photo-1045298.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1860668/pexels-photo-1860668.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "2",
    users: 5,
    role: "Super_admin",
    images: [
      {
        profile_image:
          "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-old-school-159613.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1573424/pexels-photo-1573424.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1045298/pexels-photo-1045298.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1860668/pexels-photo-1860668.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "3",
    users: 5,
    role: "Finance",
    images: [
      {
        profile_image:
          "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-old-school-159613.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1573424/pexels-photo-1573424.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1045298/pexels-photo-1045298.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1860668/pexels-photo-1860668.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "5",
    users: 5,
    role: "Trip manager",
    images: [
      {
        profile_image:
          "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-old-school-159613.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1573424/pexels-photo-1573424.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1045298/pexels-photo-1045298.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1860668/pexels-photo-1860668.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
  {
    id: "7",
    users: 5,
    role: "Support",
    images: [
      {
        profile_image:
          "https://images.pexels.com/photos/159613/ghettoblaster-radio-recorder-boombox-old-school-159613.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1573424/pexels-photo-1573424.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1762578/pexels-photo-1762578.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1045298/pexels-photo-1045298.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
      {
        profile_image:
          "https://images.pexels.com/photos/1860668/pexels-photo-1860668.jpeg?auto=compress&cs=tinysrgb&w=400",
      },
    ],
  },
];

export const SettingsRoleListData = [
  {
    id: "1",
    name: "Thelma Ojo",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Manager",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Super admin",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Finance",
    email: "trubooker@gmail.com",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Super admin",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Trip manager",
    email: "trubooker@gmail.com",
    status: "suspended",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Super admin",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    role: "Support",
    email: "trubooker@gmail.com",
    status: "active",
  },
];

export const DriverListData = [
  {
    id: "1",
    name: "Thelma Ojo",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "suspended",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
];

export const AgentListData = [
  {
    id: "1",
    name: "Thelma Ojo",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "2",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "3",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "pending",
  },
  {
    id: "4",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "5",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "suspended",
  },
  {
    id: "6",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
  {
    id: "7",
    name: "Ifeoma Nduka",
    profile_picture:
      "https://images.pexels.com/photos/20594698/pexels-photo-20594698/free-photo-of-raised-arm-with-tattoo-over-antenna.png?auto=compress&cs=tinysrgb&w=400&lazy=load",
    phone: "080-070-5069",
    email: "trubooker@gmail.com",
    status: "active",
  },
];

export const SinglePassengerListData = [
  {
    id: "1",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "completed",
  },
  {
    id: "2",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "cancelled",
  },
  {
    id: "3",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "upcoming",
  },
  {
    id: "4",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "active",
  },
  {
    id: "5",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "upcoming",
  },
  {
    id: "6",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "active",
  },
  {
    id: "7",
    departure: "City A",
    destination: "City B",
    date: "10/10/2024",
    amount: "#3000",
    status: "cancelled",
  },
];
export const SinglePassengerReferalData = [
  {
    id: "1",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "completed",
  },
  {
    id: "2",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "cancelled",
  },
  {
    id: "3",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "upcoming",
  },
  {
    id: "4",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "active",
  },
  {
    id: "5",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "upcoming",
  },
  {
    id: "6",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "active",
  },
  {
    id: "7",
    name: "Uchenna Ofor",
    date: "10/10/2024",
    status: "cancelled",
  },
];
