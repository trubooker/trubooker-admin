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
import { Button } from "../../ui/button";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTogglePassengerStatusMutation } from "@/redux/services/Slices/passenger.ApiSlice";
import toast from "react-hot-toast";
import { Modal } from "@/components/DualModal";
import { useState } from "react";

export function PassengerList({ data: Data, isFetching, loading }: any) {
  const router = useRouter();
  const [toggleStatus] = useTogglePassengerStatusMutation();
  const [selectedPassenger, setSelectedPassenger] = useState<any>(null);
  const [actionType, setActionType] = useState<"activate" | "deactivate">("activate");

  const handleToggleStatus = async (passengerId: string, currentStatus: string) => {
    try {
      await toggleStatus(passengerId).unwrap();
      toast.success(
        currentStatus === "active" 
          ? "Passenger deactivated successfully" 
          : "Passenger activated successfully"
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
      toast.error("Failed to update passenger status");
    }
  };

  const handleViewPassenger = (passengerId: string) => {
    router.push(`/passengers/${passengerId}`);
  };

  const handleSuspendClick = (passenger: any) => {
    setSelectedPassenger(passenger);
    setActionType(passenger.status === "active" ? "deactivate" : "activate");
  };

  // Helper to render verification icon
  const renderVerificationIcon = (isVerified: boolean) => {
    if (isVerified) {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    return <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div>
      {Data?.length > 0 ? (
        <Table className="min-w-[1100px] py-2">
          <TableHeader>
            <TableRow className="text-xs lg:text-sm">
              <TableHead className="font-bold w-[180px]">Name</TableHead>
              <TableHead className="font-bold w-[200px] text-center">
                Email
              </TableHead>
              <TableHead className="font-bold w-[150px] text-center">
                Phone Number
              </TableHead>
              <TableHead className="font-bold w-[130px] text-center">
                Email Verified
              </TableHead>
              <TableHead className="font-bold w-[130px] text-center">
                Phone Verified
              </TableHead>
              <TableHead className="font-bold w-[100px] text-center">
                Status
              </TableHead>
              <TableHead className="text-center font-bold w-[80px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Data?.map((data: any) => (
              <TableRow key={data.id} className="text-xs lg:text-sm w-full">
                <TableCell className="py-5 text-left">
                  <div className="w-full flex gap-x-3 items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={data?.profile_picture} />
                      <AvatarFallback>
                        <IoPersonOutline />
                      </AvatarFallback>
                    </Avatar>
                    <span className="w-full flex flex-col xl:flex-row text-start gap-x-2 gap-y-1 text-gray-500">
                      <span className="font-medium">{data.name}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-5 text-center text-gray-600">
                  {data.email}
                </TableCell>
                <TableCell className="py-5 text-center text-gray-600">
                  {data.phone_number}
                </TableCell>
                <TableCell className="py-5 text-center">
                  <div className="flex justify-center">
                    {renderVerificationIcon(data.email_verified)}
                  </div>
                </TableCell>
                <TableCell className="py-5 text-center">
                  <div className="flex justify-center">
                    {renderVerificationIcon(data.phone_verified)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {data.status === "active" ? (
                      <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[80px] bg-[#CCFFCD] text-[#00B771]">
                        <span className="w-2 h-2 bg-[#00B771] rounded-full"></span>
                        <span className="font-semibold text-xs">Active</span>
                      </div>
                    ) : data.status === "inactive" ? (
                      <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#FFF4E6] text-[--primary-orange]">
                        <span className="w-2 h-2 bg-[--primary-orange] rounded-full"></span>
                        <span className="font-semibold text-xs">Suspended</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-x-2 p-1 rounded-full justify-center w-[100px] bg-[#fc9c95] text-[--danger]">
                        <span className="w-2 h-2 bg-[--danger] rounded-full"></span>
                        <span className="font-semibold text-xs">Deleted</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="py-5 text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="cursor-pointer">
                      <DropdownMenuItem
                        onClick={() => handleViewPassenger(data?.id)}
                        className="w-full text-center cursor-pointer"
                      >
                        View Details
                      </DropdownMenuItem>
                      {data.status !== "deleted" && (
                        <DropdownMenuItem
                          className={`w-full text-center cursor-pointer ${
                            data.status === "active" ? "text-red-600" : "text-green-600"
                          }`}
                          onClick={() => handleSuspendClick(data)}
                        >
                          {data.status === "active" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <>
          {isFetching || loading ? (
            <Table className="min-w-[1100px]">
              <TableHeader>
                <TableRow className="text-xs lg:text-sm">
                  <TableHead className="text-left font-bold w-[180px]">
                    Name
                  </TableHead>
                  <TableHead className="font-bold w-[200px] text-center">
                    Email
                  </TableHead>
                  <TableHead className="font-bold w-[150px] text-center">
                    Phone Number
                  </TableHead>
                  <TableHead className="font-bold w-[130px] text-center">
                    Email Verified
                  </TableHead>
                  <TableHead className="font-bold w-[130px] text-center">
                    Phone Verified
                  </TableHead>
                  <TableHead className="font-bold w-[100px] text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-center font-bold w-[80px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                      <TableCell key={j}>
                        <div className="w-full rounded-md">
                          <Skeleton className="h-4 w-full bg-gray-200" />
                        </div>
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

      {/* Confirmation Modal for Status Change */}
      {selectedPassenger && (
        <Modal
          isOpen={!!selectedPassenger}
          onClose={() => setSelectedPassenger(null)}
          title={actionType === "activate" ? "Activate Passenger" : "Deactivate Passenger"}
          description={`Are you sure you want to ${actionType === "activate" ? "activate" : "deactivate"} ${selectedPassenger.name}?`}
          content={
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-600">
                {actionType === "activate"
                  ? "This passenger will be able to book trips again."
                  : "This passenger will no longer be able to book trips."}
              </p>
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedPassenger(null)}
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    handleToggleStatus(selectedPassenger.id, selectedPassenger.status);
                    setSelectedPassenger(null);
                  }}
                  className={actionType === "activate" 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                  }
                >
                  {actionType === "activate" ? "Activate" : "Deactivate"}
                </Button>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
}