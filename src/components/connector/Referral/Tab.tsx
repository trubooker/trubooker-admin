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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { IoPersonOutline } from "react-icons/io5";
import { formatCurrency } from "@/lib/utils";

export function Tab({ data: AgentTableData, isFetching, loading }: any) {

  const denom_amount: number = 3000;
  return (
    <div>
      {/* <ScrollArea className="w-full"> */}
      {AgentTableData?.length > 0 ? (
        <Table className=" min-w-[700px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="font-bold w-1/6 text-left">Name</TableHead>
              <TableHead className="font-bold w-1/6 text-center">
                Date referred
              </TableHead>
              <TableHead className="font-bold w-1/6 text-center">
                Status
              </TableHead>
              <TableHead className="text-center font-bold w-1/6">
                Earning status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              <>
                {AgentTableData?.map((data: any) => (
                  <TableRow
                    key={data?.id}
                    className="text-xs lg:text-sm w-full"
                  >
                    <TableCell className=" py-5 text-left text-[--primary]">
                      <div className="w-full flex gap-x-3 items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={data?.profile_picture} />
                          <AvatarFallback>
                            <IoPersonOutline />
                          </AvatarFallback>
                        </Avatar>
                        <span className="w-full flex flex-col gap-x-2 gap-y-1 text-gray-500">
                          <span className="capitalize">{data?.name} </span>
                          <small>{data?.email} </small>
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-1/7 py-5 text-center">
                      {new Date(data?.date_reffered).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </TableCell>

                    <TableCell className="w-1/7 py-5 text-center">
                      {data?.status === "active" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Verified
                          </span>
                        </div>
                      ) : data?.status === "pending" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                          <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                          <span className="font-semibold text-xs">Pending</span>
                        </div>
                      ) : data?.status === "rejected" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                          <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Rejected
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className="w-1/7 py-5 text-center">
                      {data?.total_earnings >= denom_amount ? (
                        <span>{formatCurrency(denom_amount)}</span>
                      ) : (
                        `${formatCurrency(
                          data?.total_earnings
                        )} / ${formatCurrency(denom_amount)}`
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
                    <TableHead className="text-left font-bold w-1/7">
                      Trip Id
                    </TableHead>
                    <TableHead className="font-bold w-1/7">Departure</TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Destination
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
                      Date
                    </TableHead>
                    <TableHead className="font-bold w-1/7 text-center">
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
            <div className="flex items-center w-full h-[357px] flex-col justify-center">
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
