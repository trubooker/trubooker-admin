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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Check, X, Clock, Car, FileText, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

export function DriverList({ data: Data, isFetching, loading }: any) {
  const router = useRouter();

  // Function to get badge color for document status
  const getDocStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'no documents uploaded':
        return 'bg-gray-100 text-gray-800 border border-gray-200';
      case 'no vehicle uploaded':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  // Function to get icon for document status
  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'rejected':
        return <X className="w-3 h-3" />;
      case 'no documents uploaded':
        return <FileText className="w-3 h-3" />;
      case 'no vehicle uploaded':
        return <Car className="w-3 h-3" />;
      default:
        return <FileText className="w-3 h-3" />;
    }
  };

  // Function to format document status for display
  const formatDocStatus = (status: string) => {
    if (!status) return 'No Status';
    return status
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Function to get status display
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return {
          bg: 'bg-[#CCFFCD]',
          text: 'text-[#00B771]',
          dot: 'bg-[#00B771]',
          label: 'Active'
        };
      case 'inactive':
        return {
          bg: 'bg-[#FFF4E6]',
          text: 'text-[--primary-orange]',
          dot: 'bg-[--primary-orange]',
          label: 'Suspended'
        };
      case 'deleted':
        return {
          bg: 'bg-[#fc9c95]',
          text: 'text-[--danger]',
          dot: 'bg-[--danger]',
          label: 'Deleted'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          dot: 'bg-gray-500',
          label: status
        };
    }
  };

  return (
    <div>
      <ScrollArea className="w-full">
        {Data?.length > 0 ? (
          <Table className="min-w-[1200px] py-2">
            <TableHeader>
              <TableRow className="text-xs lg:text-sm">
                <TableHead className="font-bold w-1/8">Driver</TableHead>
                <TableHead className="font-bold w-1/8 text-center">
                  Contact
                </TableHead>
                <TableHead className="font-bold w-1/8 text-center">
                  Account Status
                </TableHead>
                <TableHead className="font-bold w-1/8 text-center">
                  Vehicle Status
                </TableHead>

                <TableHead className="text-center font-bold w-1/8">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Data?.map((data: any) => {
                const statusDisplay = getStatusDisplay(data.status);
                const docStatusColor = getDocStatusColor(data.vehicle_document_status);
                const docStatusIcon = getDocStatusIcon(data.vehicle_document_status);
                
                return (
                  <TableRow key={data.id} className="text-xs lg:text-sm w-full hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={data?.profile_picture} />
                          <AvatarFallback className="bg-gray-200">
                            <IoPersonOutline className="w-5 h-5 text-gray-500" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{data.name}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4 text-center">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-gray-700">{data.email}</span>
                        <span className="text-xs text-gray-500">{data.phone_number}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <div className={`flex items-center gap-x-2 px-3 py-1.5 rounded-full ${statusDisplay.bg} ${statusDisplay.text}`}>
                          <span className={`w-2 h-2 rounded-full ${statusDisplay.dot}`}></span>
                          <span className="font-semibold text-xs">{statusDisplay.label}</span>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="py-4">
                      <div className="flex justify-center">
                        <div className={`flex items-center gap-x-2 px-3 py-1.5 rounded-full ${docStatusColor}`}>
                          {docStatusIcon}
                          <span className="font-semibold text-xs">
                            {formatDocStatus(data.vehicle_document_status)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    
                    
                    
                    <TableCell className="py-4 text-center">
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => router.push(`/drivers/${data?.id}`)}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                // Toggle driver status
                                const newStatus = data.status === 'active' ? 'inactive' : 'active';
                                console.log(`Toggle ${data.id} status to ${newStatus}`);
                                // You would call your API here
                              }}
                              className="cursor-pointer hover:bg-gray-100"
                            >
                              {data.status === 'active' ? 'Suspend' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <>
            {isFetching || loading ? (
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow className="text-xs lg:text-sm">
                    <TableHead className="font-bold w-1/8">Driver</TableHead>
                    <TableHead className="font-bold w-1/8 text-center">
                      Contact
                    </TableHead>
                    <TableHead className="font-bold w-1/8 text-center">
                      Account Status
                    </TableHead>
                    <TableHead className="font-bold w-1/8 text-center">
                      Vehicle Status
                    </TableHead>
                
                    <TableHead className="text-center font-bold w-1/8">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <TableRow key={i}>
                      {[1, 2, 3, 4, 5, 6].map((j) => (
                        <TableCell key={`${i}-${j}`}>
                          <Skeleton className="h-6 w-full bg-gray-300" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center w-full h-[400px] flex-col justify-center">
                <Image
                  src={"/nodata.svg"}
                  alt="No data"
                  width={200}
                  height={200}
                  className="object-cover"
                />
                <h1 className="mt-8 text-lg text-center font-semibold text-gray-600">
                  No drivers found
                </h1>
                <p className="text-gray-500 text-sm mt-2">
                  {Data?.length === 0 ? "No drivers match your filters" : "No data available"}
                </p>
              </div>
            )}
          </>
        )}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}