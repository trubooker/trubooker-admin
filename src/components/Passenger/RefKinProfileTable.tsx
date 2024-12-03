import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoPersonOutline } from "react-icons/io5";

export function RefKinProfileTable({
  data: RefKinProfileTableData,
  isFetching,
  loading,
}: any) {
  const router = useRouter();

  return (
    <div>
      {/* <ScrollArea className="w-full"> */}
      {RefKinProfileTableData?.length > 0 ? (
        <Table className=" min-w-[500px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="text-left font-bold w-1/3">Name</TableHead>
              <TableHead className="font-bold w-1/3 text-center">
                Date referred
              </TableHead>
              <TableHead className="font-bold w-1/3 text-center">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              <>
                {RefKinProfileTableData?.map((data: any) => (
                  <TableRow key={data.id} className="text-xs lg:text-sm w-full">
                    <TableCell className="py-5 font-medium w-1/3 text-left">
                      <div className="w-full flex gap-x-3 items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={data?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline />
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full flex flex-col xl:flex-row gap-x-2 gap-y-1 text-gray-500">
                          <span>{data.name}</span>
                          {/* <span>{data.last_name}</span> */}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/3 py-5 text-center">
                      {data.date}
                    </TableCell>
                    <TableCell>
                      {data.status === "active" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                          <span className="font-semibold text-xs">Active</span>
                        </div>
                      ) : data.status === "completed" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#E6F4FF] text-[#1E90FF]">
                          <span className="w-2 h-2 bg-[#1E90FF] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Completed
                          </span>
                        </div>
                      ) : data.status === "upcoming" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                          <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Upcoming
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                          <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Cancelled
                          </span>
                        </div>
                      )}
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
                    <TableHead className="text-left font-bold w-1/3">
                      Name
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Date referred
                    </TableHead>
                    <TableHead className="font-bold w-1/3 text-center">
                      Status
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
                                <Skeleton className="h-4 w-1/3 bg-gray-400" />
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
