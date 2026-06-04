/* eslint-disable @next/next/no-img-element */
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PiExport } from "react-icons/pi";
import { IoPersonOutline } from "react-icons/io5";
import { formatCurrency } from "@/lib/utils";
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
import {
  useApproveWithdrawalRequestMutation,
  useDeclineWithdrawalRequestMutation,
} from "@/redux/services/Slices/financeApiSlice";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { ModalProps } from "@/types";

export function AgentTransactionDetails({ data, onModalClose }: ModalProps) {
  const [approve, { isLoading: approveLoading }] =
    useApproveWithdrawalRequestMutation();
  const [decline, { isLoading: declineLoading }] =
    useDeclineWithdrawalRequestMutation();

  const handleApprove = async (id: string) => {
    try {
      await approve(id).unwrap();
      toast.success("Withdrawal Request Approved");
      onModalClose?.(); // Close modal after successful approval
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await decline(id).unwrap();
      toast.error("Withdrawal Request Denied");
      onModalClose?.(); // Close modal after successful decline
    } catch (error) {
      console.error(error);
    }
  };

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
          <AvatarImage src={data?.agent?.profile_image} />
          <AvatarFallback>
            <IoPersonOutline />
          </AvatarFallback>
        </Avatar>
        <div className="w-full">
          <p className="font-medium">
            {data?.agent?.first_name} {data?.agent?.last_name}
          </p>
          <p className="text-sm">Connector</p>
          <p className="text-sm">
            Transaction type: <span className="font-medium">Payment</span>
          </p>
        </div>
        <div className="ml-auto w-full text-end">
          {data?.status === "pending" ? (
            <span className="bg-yellow-100 text-yellow-600 text-xs font-medium px-2 py-1 rounded capitalize">
              {data?.status}
            </span>
          ) : data?.status === "approved" ? (
            <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded capitalize">
              {data?.status}
            </span>
          ) : data?.status === "declined" ? (
            <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded capitalize">
              {data?.status}
            </span>
          ) : (
            ""
          )}
        </div>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h2 className="text-sm font-bold">Earnings breakdown</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total earnings</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(data.total_earning))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Earnings paid</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(data?.earned_amount))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Requested amount</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(Number(data?.requested_amount))}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total referrals</span>
            <span className="font-medium text-gray-900">
              {data?.referral_count}
            </span>
          </div>
        </div>
      </div>

      {/* Beneficiary */}
      <div>
        <h2 className="text-sm font-bold">Bank details</h2>
        <div className="mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Bank Name</span>
            <span className="font-medium text-gray-900">
              {data?.beneficiary_details?.bank_name}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Account Number</span>
            <span className="font-medium text-gray-900">
              {data?.beneficiary_details?.account_number}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bank code</span>
            <span className="font-medium text-gray-900">
              {data?.beneficiary_details?.bank_code}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div
        className={` ${
          data?.status !== "pending" ? "hidden" : "block"
        } flex gap-x-3 justify-center`}
      >
        <Button
          disabled={approveLoading}
          className="w-full max-w-xs bg-[--primary] text-white hover:bg-[--primary-btn]"
          onClick={() => handleApprove(data?.id)}
        >
          {approveLoading ? (
            <FaSpinner
              className="animate-spin w-4 h-4 text-gray-500 mx-auto"
              size={24}
            />
          ) : (
            "Approve Request"
          )}
        </Button>
        <Button
          disabled={declineLoading}
          className="w-full max-w-xs bg-[--danger] text-white hover:bg-[--danger-btn]"
          onClick={() => handleDecline(data?.id)}
        >
          {declineLoading ? (
            <FaSpinner
              className="animate-spin w-4 h-4 text-gray-500 mx-auto"
              size={24}
            />
          ) : (
            "Deny Request"
          )}
        </Button>
      </div>

      {/* Payment Breakdown */}
      <div>
        <h2 className="text-sm font-bold">Referrals</h2>

        <div>
          {data?.refferral_details?.length > 0 ? (
            <>
              {data?.refferral_details.map((ref: any, index: number) => (
                <Accordion
                  key={index}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value={`item-${index}`}>
                    <Separator />
                    <AccordionTrigger className="border-black rounded-full p-5">
                      <h2 className="text-sm">Driver ID: {ref.driver?.id}</h2>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 bg-gray-50 rounded-lg border">
                        <div className="mb-8 space-y-2">
                          <h3 className="text-lg font-semibold">
                            Referral Details
                          </h3>
                          <p>
                            <span className="font-bold">Referral Code:</span>{" "}
                            {ref.referral_code}
                          </p>
                          <p>
                            <span className="font-bold">Agent ID:</span>{" "}
                            {ref.agent_id}
                          </p>
                        </div>
                        <div className="mb-8 space-y-2">
                          <h3 className="text-lg font-semibold">
                            Driver Information
                          </h3>
                          <p>
                            <span className="font-bold">Driver ID:</span>{" "}
                            {ref.driver?.id}
                          </p>
                          <p>
                            <span className="font-bold">Current Balance:</span>{" "}
                            {formatCurrency(
                              Number(ref.driver?.current_balance)
                            )}
                          </p>
                          <p>
                            <span className="font-bold">Year of Expiry:</span>{" "}
                            {ref.driver?.year_of_exp}
                          </p>
                          <p>
                            <span className="font-bold">License:</span>{" "}
                            <a
                              href={ref.driver?.license}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View License
                            </a>
                          </p>
                        </div>
                        <div className="mb-8 space-y-2">
                          <h3 className="text-lg font-semibold">
                            Transaction Information
                          </h3>
                          <p>
                            <span className="font-bold">Earned Amount:</span> $
                            {ref.earned_amount}
                          </p>
                          <p>
                            <span className="font-bold">Created At:</span>{" "}
                            {new Date(ref.created_at).toLocaleString()}
                          </p>
                          <p>
                            <span className="font-bold">Updated At:</span>{" "}
                            {new Date(ref.updated_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </>
          ) : (
            <div className="flex items-center w-full h-[400px] flex-col justify-center">
              <Image
                src={"/nodata.svg"}
                alt="No Data Available"
                width={200}
                height={200}
                className="object-cover me-5"
              />
              <h1 className="mt-8 text-lg text-center font-semibold">
                No Data
              </h1>
            </div>
          )}
        </div>

        <Separator />

        {data?.status === "approved" ? (
          <p className="text-xs mt-10 text-end w-full text-gray-500">
            Notes: Payment processed successfully.
          </p>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
