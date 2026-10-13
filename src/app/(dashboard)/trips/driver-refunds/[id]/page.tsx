"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { IoPersonOutline } from "react-icons/io5";
import { MapPin, Clock, User, Car, ArrowLeft } from "lucide-react";
import {
  useGetSingleNoShowQuery,
  useApproveNoShowMutation,
  useDeclineNoShowMutation,
} from "@/redux/services/Slices/tripsApiSlice";

const formatDateTime = (iso?: string) => {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-NG", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

const STATUS_STYLES: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  pending: { bg: "#FFF4E6", text: "#FFA500", label: "Pending" },
  approved: { bg: "#CCFFCD", text: "#00B771", label: "Approved" },
  declined: { bg: "#FFE6E6", text: "#FF4500", label: "Declined" },
};

const StatusBadge = ({ status }: { status?: string }) => {
  const key = (status || "").toLowerCase();
  const style =
    STATUS_STYLES[key] || {
      bg: "#F1F1F1",
      text: "#6B7280",
      label: status || "N/A",
    };
  return (
    <div
      className="flex items-center gap-x-2 py-1 px-3 rounded-full"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: style.text }}
      ></span>
      <span className="font-semibold capitalize text-xs">{style.label}</span>
    </div>
  );
};

const DriverRefundDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const {
    data: response,
    isLoading,
    isError,
  } = useGetSingleNoShowQuery(id);

  const [approveNoShow, { isLoading: approving }] =
    useApproveNoShowMutation();
  const [declineNoShow, { isLoading: declining }] =
    useDeclineNoShowMutation();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [declineReason, setDeclineReason] = useState("");

  const data = response?.result || response?.data;

  const handleApprove = async () => {
    try {
      await approveNoShow({ id, adminNote }).unwrap();
      setShowApproveModal(false);
      setAdminNote("");
      router.push("/trips");
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) return;
    try {
      await declineNoShow({ id, reason: declineReason }).unwrap();
      setShowDeclineModal(false);
      setDeclineReason("");
      router.push("/trips");
    } catch (err) {
      console.error("Decline failed:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-48 w-full mb-4" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            Failed to load refund details
          </h2>
          <Button className="mt-4" onClick={() => router.push("/trips")}>
            Back to Trips
          </Button>
        </div>
      </div>
    );
  }

  const lat = data.latitude;
  const lng = data.longitude;
  const mapEmbed = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-x-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-gray-200 transition"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Driver Refund Request
        </h1>
        <StatusBadge status={data.status} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Driver info */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-x-2">
              <Car size={16} /> Driver
            </h2>
            <div className="flex items-center gap-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={data.driver?.profileImage} />
                <AvatarFallback>
                  <IoPersonOutline size={24} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-800">
                  {data.driver?.firstName} {data.driver?.lastName}
                </span>
                <small className="text-gray-500">{data.driver?.email}</small>
                {data.driver?.phone && (
                  <small className="text-gray-500">{data.driver.phone}</small>
                )}
              </div>
            </div>
          </div>

          {/* Passenger info */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-x-2">
              <User size={16} /> Passenger
            </h2>
            <div className="flex items-center gap-x-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={data.passenger?.profileImage} />
                <AvatarFallback>
                  <IoPersonOutline size={24} />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-semibold text-gray-800">
                  {data.passenger?.firstName} {data.passenger?.lastName}
                </span>
                <small className="text-gray-500">{data.passenger?.email}</small>
                {data.booking?.bookingCode && (
                  <small className="text-gray-500">
                    Booking: {data.booking.bookingCode}
                  </small>
                )}
              </div>
            </div>
          </div>

          {/* Reported at */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-x-2">
              <Clock size={16} /> Reported at
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              {formatDateTime(data.reportedAt || data.createdAt)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              The exact moment the driver pressed the "Passenger didn't show
              up?" button
            </p>
          </div>

          {/* Trip info */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              Trip route
            </h2>
            <div className="flex flex-col gap-y-3">
              <div>
                <small className="text-gray-500">From</small>
                <p className="font-medium text-gray-800">
                  {data.trip?.departureLocation?.name ||
                    data.trip?.departureLocation ||
                    "—"}
                </p>
              </div>
              <div>
                <small className="text-gray-500">To</small>
                <p className="font-medium text-gray-800">
                  {data.trip?.arrivalDestination?.[0]?.name ||
                    data.trip?.arrivalDestination?.name ||
                    "—"}
                </p>
              </div>
              {data.trip?.departureDate && (
                <div>
                  <small className="text-gray-500">Departure</small>
                  <p className="font-medium text-gray-800">
                    {data.trip.departureDate} {data.trip.departureTime}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Location + Map */}
          <div className="bg-white rounded-xl p-5">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-4 flex items-center gap-x-2">
              <MapPin size={16} /> Driver's location when reporting
            </h2>
            <a
              href={mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-x-2 px-4 py-2 rounded-lg bg-[#E6F4FF] text-[#1E90FF] hover:bg-[#CFE9FF] transition font-medium text-sm mb-4"
            >
              <MapPin size={16} />
              {lat}, {lng}
            </a>

            <div className="rounded-lg overflow-hidden border border-gray-200">
              <iframe
                title="Driver location"
                src={mapEmbed}
                width="100%"
                height="320"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <p className="text-xs text-gray-400 mt-2">
              Compare this location with the trip's departure point to verify
              the driver was actually there.
            </p>
          </div>

          {/* Actions */}
          {data.status === "pending" && (
            <div className="bg-white rounded-xl p-5 flex flex-col gap-3">
              <Button
                className="w-full bg-[#00B771] hover:bg-[#009b5f] text-white"
                onClick={() => setShowApproveModal(true)}
                disabled={approving || declining}
              >
                Approve refund
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeclineModal(true)}
                disabled={approving || declining}
              >
                Decline refund
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Approve modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-2">Approve refund</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will credit the driver's wallet. Add an optional admin note.
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Optional admin note..."
              className="w-full border rounded-lg p-3 text-sm mb-4 min-h-[100px]"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
                disabled={approving}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#00B771] hover:bg-[#009b5f] text-white"
                onClick={handleApprove}
                disabled={approving}
              >
                {approving ? "Approving..." : "Confirm"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Decline modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold mb-2">Decline refund</h3>
            <p className="text-sm text-gray-500 mb-4">
              Please provide a reason. This will be shown to the driver.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="Reason for declining..."
              className="w-full border rounded-lg p-3 text-sm mb-4 min-h-[100px]"
            />
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDeclineModal(false)}
                disabled={declining}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDecline}
                disabled={declining || !declineReason.trim()}
              >
                {declining ? "Declining..." : "Confirm decline"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverRefundDetails;