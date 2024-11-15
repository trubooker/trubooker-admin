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

export function StudentList({
  data: StudentListData,
  isFetching,
  loading,
}: any) {
  return (
    <>
      {StudentListData?.length > 0 ? (
        <Table className=" min-w-[700px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="text-left font-bold w-1/7">Name</TableHead>
              <TableHead className="font-bold w-1/7 text-center">
                Email
              </TableHead>
              <TableHead className="font-bold w-1/7 text-center">
                Country
              </TableHead>
              <TableHead className="font-bold w-1/7 text-center">
                Courses Enrolled
              </TableHead>
              <TableHead className="font-bold w-1/7 text-center">
                Last Login
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
            <>
              <>
                {StudentListData?.map((data: any) => (
                  <TableRow key={data.id} className="text-xs lg:text-sm">
                    <TableCell className=" py-5 font-medium w-1/6 me-4 text-left">
                      <div className="w-full flex gap-x-3 items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={data?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline />
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full flex flex-col xl:flex-row gap-x-2 gap-y-1 text-gray-500">
                          <span>{data.first_name} </span>
                          <span>{data.last_name}</span>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className=" py-5 w-1/6 text-center text-[--primary]">
                      {data.email}
                    </TableCell>
                    <TableCell className=" py-5 w-1/6 text-center">
                      {data.country}
                    </TableCell>
                    <TableCell className=" py-5 w-1/6 text-center">
                      {data.course_count}
                    </TableCell>
                    <TableCell className=" py-5 w-1/6 text-center">
                      20 minutes ago
                      {/* {data.last_login} */}
                    </TableCell>
                    <TableCell>
                      {data.status === "active" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                          <span className="font-semibold text-xs">active</span>
                        </div>
                      ) : (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#fbbcbc] text-[#FC4444]">
                          <span className="w-2 h-2 bg-[#FC4444] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Inactive
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className=" py-5 w-1/6 text-center">
                      <Link
                        href={`/students/${data.id}/about`}
                        className="underline text-[--primary] font-bold"
                      >
                        View Details
                      </Link>
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
                      Name
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Email
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Country
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Courses Enrolled
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Last Login
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
    </>
  );
}
