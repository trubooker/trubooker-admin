import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../../ui/separator";
import { Button } from "../../ui/button";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "../../ui/scroll-area";

export function Roles_Table({ data: Data, isFetching, loading }: any) {
  const router = useRouter();

  const handleSuspend = (id: string) => {
    alert(`Account id ${id} suspended!!`);
  };

  return (
    <div>
      {/* <ScrollArea className="w-full"> */}
      {Data?.length > 0 ? (
        <Table className=" min-w-[900px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              {/* <TableHead className="text-left font-bold w-[200px]">
                Id
              </TableHead> */}
              <TableHead className="font-bold w-1/5">Username</TableHead>
              <TableHead className="font-bold w-1/5 text-center">
                Email
              </TableHead>
              <TableHead className="font-bold w-1/5 text-center">
                Phone Number
              </TableHead>
              <TableHead className="font-bold w-1/5 text-center">
                Roles
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              <>
                {Data?.map((data: any) => (
                  <TableRow key={data.id} className="text-xs lg:text-sm w-full">
                    <TableCell className=" py-5 text-center text-[--primary]">
                      <div className="w-full flex gap-x-3 items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={data?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline />
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full flex justify-start text-left  flex-row gap-x-2 gap-y-1 text-gray-500">
                          <span>{data.first_name} </span>
                          <span>{data.last_name} </span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className=" py-5 text-center text-[--primary]">
                      {data.email}
                    </TableCell>
                    <TableCell className=" py-5 text-center">
                      {data?.phone}
                    </TableCell>
                    <TableCell className="capitalize py-5 text-center">
                      {data.role === "agent" ? "connector" : data.role}
                    </TableCell>
                  </TableRow>
                ))}
              </>
            </>
          </TableBody>
        </Table>
      ) : (
        <>
          {isFetching || loading ? (
            <>
              <Table className="">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm">
                    <TableHead className="text-left font-bold w-1/7">
                      Username
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Email
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Roles
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-center font-bold w-1/7">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <TableCell key={i}>
                          <div>
                            <div className="w-full rounded-md">
                              <div>
                                <Skeleton className="h-4 w-1/7 bg-gray-400" />
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="flex items-center w-full h-[400px] flex-col justify-center">
              <Image
                src={"/nodata.svg"}
                alt=""
                width={200}
                height={200}
                className="object-cover me-5"
              />
              <h1 className="mt-8 text-lg text-center font-semibold">
                No Data
              </h1>
            </div>
          )}
        </>
      )}
    </div>
  );
}
