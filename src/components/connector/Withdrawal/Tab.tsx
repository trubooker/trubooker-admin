import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";

import { useRouter } from "next/navigation";

export function Tab({ data: PassengerTableData, isFetching, loading }: any) {
  const router = useRouter();

  const handleSuspend = (id: string) => {
    alert(`Account id ${id} suspended!!`);
  };
  console.log("withdrawalreq: ", PassengerTableData);
  return (
    <div>
      {/* <ScrollArea className="w-full"> */}
      {PassengerTableData?.length > 0 ? (
        <Table className=" min-w-[700px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="text-center font-bold w-1/3">
                Amount
              </TableHead>
              <TableHead className="font-bold w-1/3 text-center">
                Status
              </TableHead>
              <TableHead className="font-bold w-1/3 text-center">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              <>
                {PassengerTableData?.map((data: any) => (
                  <TableRow key={data.id} className="text-xs lg:text-sm w-full">
                    <TableCell className="w-1/3 py-5 text-center">
                      {formatCurrency(Number(data.amount))}
                    </TableCell>
                    <TableCell className="w-1/3 py-5 text-center">
                      {data.status === "approved" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#CCFFCD] text-[#00B771]">
                          <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Approved
                          </span>
                        </div>
                      ) : data.status === "pending" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                          <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                          <span className="font-semibold text-xs">Pending</span>
                        </div>
                      ) : data.status === "declined" ? (
                        <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                          <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                          <span className="font-semibold text-xs">
                            Declined
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                    </TableCell>
                    <TableCell className="w-1/3 py-5 text-center">
                      {new Date(data?.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
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
                      Amount
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
