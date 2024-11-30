import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PiExport } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";

export function TransactionDetails() {
  return (
    <div className="flex flex-col gap-y-8 text-[#667085]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          {/* <h1 className="text-lg font-semibold">Transaction details</h1> */}
          <p className="text-sm">
            Transaction ID: <span className="font-medium">TX-20240930</span>
          </p>
          <p className="text-sm">Date/Time: 09/30/2024 10:32 AM</p>
        </div>
        <div>
          <button className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
            <PiExport size={16} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-start space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={""} />
          <AvatarFallback>
            <IoPersonOutline />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="font-medium">Micheal Adebayo</p>
          <p className="text-sm">Driver</p>
          <p className="text-sm">
            Transaction type: <span className="font-medium">Payment</span>
          </p>
        </div>
        <div className="ml-auto w-full text-end">
          <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-1 rounded">
            Pending
          </span>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h2 className="text-sm font-bold">Payment breakdown</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Trip earnings</span>
            <span className="font-medium text-gray-900">₦12,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Trubookes fee</span>
            <span className="font-medium text-gray-900">₦2,000</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Net payout</span>
            <span className="font-medium text-gray-900">₦10,000</span>
          </div>
        </div>
      </div>

      {/* Trip Information */}
      <div>
        <h2 className="text-sm font-bold">Trip information</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Trip ID</span>
            <span className="font-medium text-gray-900">#234XZA</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Booking date</span>
            <span className="font-medium text-gray-900">01/01/2024</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Departure</span>
            <span className="font-medium text-gray-900">Wuse Abuja</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Destination</span>
            <span className="font-medium text-gray-900">Ogarinma Kogi</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Departure date & time</span>
            <span className="font-medium text-gray-900">
              01/01/2024, 09:00 AM
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Arrival date & time</span>
            <span className="font-medium text-gray-900">
              01/01/2024, 03:00 AM
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total passengers</span>
            <span className="font-medium text-gray-900">12</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total payment</span>
            <span className="font-medium text-gray-900">₦120,000</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center">
        <Button className="w-full max-w-xs bg-blue-600 text-white hover:bg-blue-700">
          Process payment
        </Button>
      </div>
    </div>
  );
}
