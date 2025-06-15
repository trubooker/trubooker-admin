/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PiExport } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// import { Skeleton } from "../ui/skeleton";
// import { Table, TableHead, TableHeader, TableRow } from "../ui/table";
import Image from "next/image";
import { Separator } from "../ui/separator";

export function TransactionDetails({ data }: any) {
  return (
    <div className="flex flex-col gap-y-8 text-[#667085]">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          {/* <h1 className="text-lg font-semibold">Transaction details</h1> */}
          <p className="text-sm">
            Transaction ID:{" "}
            <span className="font-medium">{data?.transactionID}</span>
          </p>
          <p className="text-sm">Date/Time: {data?.transaction_date}</p>
        </div>
        {/* <div>
          <button className="flex items-center space-x-1 text-blue-600 text-sm font-medium">
            <PiExport size={16} />
            <span>Export PDF</span>
          </button>
        </div> */}
      </div>

      {/* User Info */}
      <div className="flex items-start space-x-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={data?.driver?.profile_picture} />
          <AvatarFallback>
            <IoPersonOutline />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="font-medium">
            {data?.driver?.first_name} {data?.driver?.last_name}
          </p>
          <p className="text-sm">Driver</p>
          <p className="text-sm">
            Transaction type: <span className="font-medium">Payment</span>
          </p>
        </div>
        <div className="ml-auto w-full text-end">
          <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-1 rounded capitalize">
            {data?.status}
          </span>
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h2 className="text-sm font-bold">Payment breakdown</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Trip earnings</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data?.driver_earning)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Trubooker&apos;s fee</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data?.platform_earning)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Net payout</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(data?.net_earning))}
            </span>
          </div>
        </div>
      </div>

      {/* Trip Information */}
      <div>
        <h2 className="text-sm font-bold">Trip information</h2>
        <div className="mt-2 space-y-2">
          {/* <div className="flex justify-between text-sm">
            <span>Trip ID</span>
            <span className="font-medium text-gray-900">#234XZA</span>
          </div> */}
          {/* <div className="flex justify-between text-sm">
            <span>Booking date</span>
            <span className="font-medium text-gray-900">01/01/2024</span>
          </div> */}
          {/* <div className="flex justify-between text-sm">
            <span>Departure</span>
            <span className="font-medium text-gray-900">Wuse Abuja</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Destination</span>
            <span className="font-medium text-gray-900">Ogarinma Kogi</span>
          </div> */}
          <div className="flex justify-between text-sm">
            <span>Departure date & time</span>
            <span className="font-medium text-gray-900">
              {formatDateTime(
                data?.trip_date?.departure_date,
                data?.trip_date?.departure_time
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Arrival date & time</span>
            <span className="font-medium text-gray-900">
              {formatDateTime(
                data?.trip_date?.arrival_date,
                data?.trip_date?.arrival_time
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total passengers</span>
            <span className="font-medium text-gray-900">
              {data?.total_passengers}
            </span>
          </div>
          {/* <div className="flex justify-between text-sm">
            <span>Total payment</span>
            <span className="font-medium text-gray-900">₦120,000</span>
          </div> */}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h2 className="text-sm font-bold">Ticket Information</h2>

        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-1`} className="">
              <AccordionTrigger className="border-black text-[--primary] rounded-full p-5">
                <h2 className="text-sm">Verified Tickets</h2>
              </AccordionTrigger>
              <Separator />
              <AccordionContent>
                {data?.verified_tickets?.length > 0 ? (
                  <>
                    {data?.verified_tickets.map(
                      (ticket: any, index: number) => (
                        <Accordion
                          key={index}
                          type="single"
                          collapsible
                          className="w-full"
                        >
                          <AccordionItem value={`item-1`} className=" ms-5">
                            <Separator />
                            <AccordionTrigger className="border-black rounded-full p-5">
                              <h2 className="text-sm">
                                {ticket.ticket_number}
                              </h2>
                            </AccordionTrigger>
                            <AccordionContent>
                              <>
                                <div key={index} className="mt-2 space-y-4">
                                  <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                    <p className="text-sm">
                                      Amount:{" "}
                                      <span className="font-medium">
                                        {formatCurrency(ticket.amount)}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      Extra Luggage:{" "}
                                      <span className="font-medium">
                                        {ticket.extra_luggage || "None"}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      Status:{" "}
                                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                        {ticket.status}
                                      </span>
                                    </p>
                                  </div>
                                  {/* QR Code */}
                                  <div>
                                    <h2 className="text-sm font-bold">
                                      QR Code
                                    </h2>
                                    <div className="flex justify-center my-4">
                                      {ticket?.qr_code === null ? (
                                        <div className="flex items-center w-full h-[200px] flex-col justify-center">
                                          <Image
                                            src={"/nodata.svg"}
                                            alt=""
                                            width={100}
                                            height={100}
                                            className="object-cover me-5"
                                          />
                                          <h1 className="mt-8 text-lg text-center font-semibold">
                                            No QR Code
                                          </h1>
                                        </div>
                                      ) : (
                                        <Image
                                          src={ticket?.qr_code}
                                          alt="QR Code"
                                          width={300}
                                          height={300}
                                          // className="w-32 h-32 object-cover"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )
                    )}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <Separator />
        <div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-1`} className="">
              <AccordionTrigger className="border-black text-[--primary] rounded-full p-5">
                <h2 className="text-sm">Unverified Tickets</h2>
              </AccordionTrigger>
              <AccordionContent>
                {data?.unverified_tickets?.length > 0 ? (
                  <>
                    {data?.unverified_tickets.map(
                      (ticket: any, index: number) => (
                        <Accordion
                          key={index}
                          type="single"
                          collapsible
                          className="w-full"
                        >
                          <AccordionItem value={`item-1`} className=" ms-5">
                            <AccordionTrigger className="border-black rounded-full p-5">
                              <h2 className="text-sm">
                                {ticket.ticket_number}
                              </h2>
                            </AccordionTrigger>
                            <Separator />
                            <AccordionContent>
                              <>
                                <div key={index} className="mt-2 space-y-4">
                                  <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                                    <p className="text-sm">
                                      Ticket Number:{" "}
                                      <span className="font-medium">
                                        {ticket.ticket_number}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      Amount:{" "}
                                      <span className="font-medium">
                                        {formatCurrency(ticket.amount)}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      Extra Luggage:{" "}
                                      <span className="font-medium">
                                        {ticket.extra_luggage || "None"}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      Status:{" "}
                                      <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-xs">
                                        {ticket.status}
                                      </span>
                                    </p>
                                  </div>
                                  {/* QR Code */}
                                  <div>
                                    <h2 className="text-sm font-bold">
                                      QR Code
                                    </h2>
                                    <div className="flex justify-center mt-4">
                                      <Image
                                        src={ticket?.qr_code}
                                        alt="QR Code"
                                        width={300}
                                        height={300}
                                        // className="w-32 h-32 object-cover"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      )
                    )}
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Payment Summary */}
        <div>
          <h2 className="text-sm font-bold">Payment Summary</h2>
          <div className="mt-2 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total Before Discount:</span>
              <span className="font-medium">
                {formatCurrency(data?.total_before_discount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total After Discount:</span>
              <span className="font-medium">
                {formatCurrency(data?.total_after_discount)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {/* <div className="flex justify-center">
        <Button className="w-full max-w-xs bg-blue-600 text-white hover:bg-blue-700">
          Process payment
        </Button>
      </div> */}
    </div>
  );
}
