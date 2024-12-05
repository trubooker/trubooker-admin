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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { useParams, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function DriverTable({
  data: DriverTableData,
  isFetching,
  loading,
}: any) {
  const router = useRouter();

  const handleDelete = (id: string) => {
    alert(`Trip with id # ${id} Deleted!!`);
  };

  const params = useParams();
  const driverId = params.driverId;
  return (
    <div>
      {/* <ScrollArea className="w-full"> */}
      {DriverTableData?.length > 0 ? (
        <Table className=" min-w-[900px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="font-bold w-1/7">Departure</TableHead>

              <TableHead className="font-bold w-1/7 text-left">
                Destination
              </TableHead>

              <TableHead className="font-bold w-1/7 text-center">
                Amount paid
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
              {DriverTableData?.map((data: any) => (
                <TableRow
                  key={data.trip_id}
                  className="text-xs lg:text-sm w-full justify-start"
                >
                  {/* <TableCell># {data?.trip_id}</TableCell> */}
                  <TableCell className="w-1/7 py-5 text-left ">
                    <div className="flex flex-col">
                      <span> {data.departure_location}</span>
                      <small className="mt-1 font-light flex gap-x-2">
                        <span className="font-normal">Date:</span>{" "}
                        {data.departure_date}, {data?.departure_time}
                      </small>
                    </div>
                  </TableCell>
                  <TableCell className="w-1/7 py-5 text-left ">
                    <div className="flex flex-col">
                      <span> {data.arrival_location?.address}</span>
                      <small className="mt-1 font-light flex gap-x-2">
                        <span className="font-normal">Date:</span>{" "}
                        {data.arrival_date}, {data?.arrival_time}
                      </small>
                      <small className="mt-1 font-light flex gap-x-2">
                        <span className="font-normal">Latitude:</span>{" "}
                        {data.arrival_location?.latitude}
                      </small>
                      <small className="mt-1 font-light flex gap-x-2">
                        <span className="font-normal">Longitude:</span>{" "}
                        {data.arrival_location?.longitude}
                      </small>
                    </div>
                  </TableCell>

                  <TableCell className="w-1/7 py-5 text-center">
                    {formatCurrency(data?.amount)}
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
                        <span className="font-semibold text-xs">Completed</span>
                      </div>
                    ) : data.status === "pending" ? (
                      <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[#FFA500]">
                        <span className="w-2 h-2 bg-[#FFA500] rounded-full"></span>
                        <span className="font-semibold text-xs">Pending</span>
                      </div>
                    ) : (
                      <div className="flex items-center mx-auto gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFE6E6] text-[#FF4500]">
                        <span className="w-2 h-2 bg-[#FF4500] rounded-full"></span>
                        <span className="font-semibold text-xs">Cancelled</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="w-1/7 py-5 text-center w-[100px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="center"
                        className="cursor-pointer"
                      >
                        <DropdownMenuItem
                          className="w-full text-center cursor-pointer"
                          // onClick={() => handleDelete(data?.trip_id)}
                          onClick={() =>
                            router.push(
                              `/drivers/${driverId}/trip-detail/${data?.trip_id}`
                            )
                          }
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
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
