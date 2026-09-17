"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import {
  useSetPricePerKmMutation,
  useUpdateDispatchWindowMutation,
} from "@/redux/services/Slices/settings/appSettingsApiSlice";
import { useGetSystemSettingsQuery } from "@/redux/services/Slices/settings/referralProgramApiSlice";
import {
  RefreshCw,
  Save,
  AlertTriangle,
  DollarSign,
  Timer,
  Car,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DispatchWindowForm {
  intraStateDispatchWindowHours: string;
  interStateDispatchWindowHours: string;
}

const DEFAULT_DISPATCH: DispatchWindowForm = {
  intraStateDispatchWindowHours: "",
  interStateDispatchWindowHours: "",
};

// Backend caps both dispatch windows at 168 hours (7 days)
const MAX_DISPATCH_HOURS = 168;

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Extract the first useful error message from an RTK Query error.
// Handles: NestJS field errors, plain message, network errors.
const extractErrorMessage = (err: any, fallback: string): string => {
  const data = err?.data;

  // NestJS field-level: { errors: [{ field, errors: [msg] }] }
  if (Array.isArray(data?.errors)) {
    const fieldMsgs = data.errors
      .flatMap((e: any) =>
        Array.isArray(e?.errors)
          ? e.errors
          : typeof e === "string"
          ? [e]
          : []
      )
      .filter(Boolean);
    if (fieldMsgs.length) return fieldMsgs.join("; ");
  }

  // NestJS top-level: { message: "..." } or { message: ["...", "..."] }
  if (Array.isArray(data?.message)) return data.message.join("; ");
  if (typeof data?.message === "string") return data.message;

  // Plain error string
  if (typeof err?.error === "string") return err.error;

  return fallback;
};

// ─── Component ────────────────────────────────────────────────────────────────

const TripRequestSettings = () => {
  // ── Price per km state ───────────────────────────────────────────────────
  const [pricePerKm, setPriceInput] = useState<string>("");
  const [showPriceConfirm, setShowPriceConfirm] = useState(false);
  const [isConfirmingPrice, setIsConfirmingPrice] = useState(false);

  // ── Dispatch window state ────────────────────────────────────────────────
  const [dispatch, setDispatch] = useState<DispatchWindowForm>(DEFAULT_DISPATCH);
  const [showDispatchConfirm, setShowDispatchConfirm] = useState(false);
  const [isConfirmingDispatch, setIsConfirmingDispatch] = useState(false);

  // ── Queries ──────────────────────────────────────────────────────────────

  const {
    data: systemSettingsData,
    isLoading,
    refetch,
  } = useGetSystemSettingsQuery(null);

  const [setPricePerKm, { isLoading: isSettingPrice }] =
    useSetPricePerKmMutation();

  const [updateDispatchWindow, { isLoading: isUpdatingDispatch }] =
    useUpdateDispatchWindowMutation();

  // ── Extract price_control entry from response ────────────────────────────

  const priceControl = systemSettingsData?.result?.find(
    (entry: { key: string }) => entry.key === "price_control"
  );

  // ── Seed local state from get-all ────────────────────────────────────────

  useEffect(() => {
    if (!priceControl?.value) return;
    const v = priceControl.value;

    const price = v.perKmRate ?? v.pricePerKm ?? "";
    setPriceInput(price !== "" && price !== null ? String(price) : "");

    const intra = v.intraStateDispatchWindowHours ?? "";
    const inter = v.interStateDispatchWindowHours ?? "";

    setDispatch({
      intraStateDispatchWindowHours:
        intra !== "" && intra !== null ? String(intra) : "",
      interStateDispatchWindowHours:
        inter !== "" && inter !== null ? String(inter) : "",
    });
  }, [priceControl]);

  const priceBusy = isSettingPrice || isConfirmingPrice;
  const dispatchBusy = isUpdatingDispatch || isConfirmingDispatch;

  const patchDispatch = (field: keyof DispatchWindowForm, value: string) =>
    setDispatch((prev) => ({ ...prev, [field]: value }));

  // ── Price handlers ───────────────────────────────────────────────────────

  const handlePriceSaveClick = () => {
    const num = Number(pricePerKm);

    if (!pricePerKm.trim() || isNaN(num) || num <= 0) {
      toast.error("Price per km must be a positive number", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    setShowPriceConfirm(true);
  };

  const confirmPriceSave = async () => {
    if (isConfirmingPrice) return;
    setIsConfirmingPrice(true);

    const num = Number(pricePerKm);

    try {
      await setPricePerKm({ pricePerKm: num }).unwrap();
      setIsConfirmingPrice(false);
      setShowPriceConfirm(false);
      toast.success(`Price set to ₦${num.toLocaleString()} per km ✅`, {
        position: "top-right",
        duration: 4000,
        icon: "💰",
      });
    } catch (e: any) {
      setIsConfirmingPrice(false);
      setShowPriceConfirm(false);
      toast.error(
        extractErrorMessage(e, "Failed to set price per km"),
        { position: "top-right", duration: 8000 }
      );
    }
  };

  // ── Dispatch handlers ────────────────────────────────────────────────────

  const handleDispatchSaveClick = () => {
    const intraRaw = dispatch.intraStateDispatchWindowHours.trim();
    const interRaw = dispatch.interStateDispatchWindowHours.trim();

    // Intra-state
    if (!intraRaw) {
      toast.error("Intra-state window is required", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    const intra = Number(intraRaw);
    if (isNaN(intra) || intra <= 0) {
      toast.error("Intra-state window must be greater than 0", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    if (intra > MAX_DISPATCH_HOURS) {
      toast.error(
        `Intra-state window cannot exceed ${MAX_DISPATCH_HOURS} hours (7 days)`,
        { position: "top-right", duration: 4000 }
      );
      return;
    }

    // Inter-state
    if (!interRaw) {
      toast.error("Inter-state window is required", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    const inter = Number(interRaw);
    if (isNaN(inter) || inter <= 0) {
      toast.error("Inter-state window must be greater than 0", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    if (inter > MAX_DISPATCH_HOURS) {
      toast.error(
        `Inter-state window cannot exceed ${MAX_DISPATCH_HOURS} hours (7 days)`,
        { position: "top-right", duration: 4000 }
      );
      return;
    }

    setShowDispatchConfirm(true);
  };

  const confirmDispatchSave = async () => {
    if (isConfirmingDispatch) return;
    setIsConfirmingDispatch(true);

    const payload = {
      intraStateDispatchWindowHours: Number(
        dispatch.intraStateDispatchWindowHours
      ),
      interStateDispatchWindowHours: Number(
        dispatch.interStateDispatchWindowHours
      ),
    };

    try {
      await updateDispatchWindow(payload).unwrap();
      setIsConfirmingDispatch(false);
      setShowDispatchConfirm(false);
      toast.success("Dispatch window updated ✅", {
        position: "top-right",
        duration: 4000,
      });
    } catch (e: any) {
      setIsConfirmingDispatch(false);
      setShowDispatchConfirm(false);
      toast.error(
        extractErrorMessage(e, "Failed to update dispatch window"),
        { position: "top-right", duration: 8000 }
      );
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Trip Request Settings</h2>
          <p className="text-gray-500">
            Configure pricing and how early drivers can see trip requests
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            refetch();
            toast.success("Refreshed!", {
              position: "top-right",
              duration: 2000,
            });
          }}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* ── Price Per Km Card ───────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Price Per Kilometer
              </CardTitle>
              <CardDescription>
                Set the per-kilometer rate for rides
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handlePriceSaveClick}
              disabled={priceBusy || isLoading}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {priceBusy ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Price
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="price-per-km">Price Per Kilometer</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                    ₦
                  </span>
                  <Input
                    id="price-per-km"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 150.00"
                    value={pricePerKm}
                    onChange={(e) => setPriceInput(e.target.value)}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Amount charged per kilometer traveled
                </p>
              </div>

              {pricePerKm && Number(pricePerKm) > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Current Rate
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Riders are currently charged{" "}
                        <strong>
                          ₦
                          {Number(pricePerKm).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </strong>{" "}
                        per kilometer.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Dispatch Window Card ────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Dispatch Window
              </CardTitle>
              <CardDescription>
                How many hours before pickup a trip request becomes visible to
                drivers (max {MAX_DISPATCH_HOURS} hours / 7 days)
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleDispatchSaveClick}
              disabled={dispatchBusy || isLoading}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {dispatchBusy ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Window
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="intra-state">
                    Intra-State Dispatch Window (Hours)
                  </Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="intra-state"
                      type="number"
                      min="1"
                      max={MAX_DISPATCH_HOURS}
                      step="1"
                      placeholder="e.g., 48"
                      value={dispatch.intraStateDispatchWindowHours}
                      onChange={(e) =>
                        patchDispatch(
                          "intraStateDispatchWindowHours",
                          e.target.value
                        )
                      }
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    How many hours before a{" "}
                    <strong>same-state</strong> trip request is shown to
                    drivers. Max {MAX_DISPATCH_HOURS} hours.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inter-state">
                    Inter-State Dispatch Window (Hours)
                  </Label>
                  <div className="relative">
                    <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="inter-state"
                      type="number"
                      min="1"
                      max={MAX_DISPATCH_HOURS}
                      step="1"
                      placeholder="e.g., 96"
                      value={dispatch.interStateDispatchWindowHours}
                      onChange={(e) =>
                        patchDispatch(
                          "interStateDispatchWindowHours",
                          e.target.value
                        )
                      }
                      className="pl-9"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    How many hours before a{" "}
                    <strong>cross-state</strong> trip request is shown to
                    drivers. Max {MAX_DISPATCH_HOURS} hours.
                  </p>
                </div>
              </div>

              {dispatch.intraStateDispatchWindowHours &&
                dispatch.interStateDispatchWindowHours && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Timer className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-medium text-blue-800">
                          Current Dispatch Windows
                        </h4>
                        <p className="text-sm text-blue-700 mt-1">
                          Drivers see <strong>same-state</strong> trip requests{" "}
                          <strong>
                            {Number(
                              dispatch.intraStateDispatchWindowHours
                            ).toLocaleString()}{" "}
                            hours
                          </strong>{" "}
                          before pickup, and <strong>cross-state</strong>{" "}
                          requests{" "}
                          <strong>
                            {Number(
                              dispatch.interStateDispatchWindowHours
                            ).toLocaleString()}{" "}
                            hours
                          </strong>{" "}
                          before pickup.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Price Confirm */}
      <AlertDialog open={showPriceConfirm} onOpenChange={setShowPriceConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Price Per Km?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately set the rate to{" "}
              <strong>
                ₦
                {Number(pricePerKm || 0).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </strong>{" "}
              per kilometer for all new rides.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirmingPrice}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={confirmPriceSave}
              disabled={isConfirmingPrice}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {isConfirmingPrice ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Confirm Save"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dispatch Confirm */}
      <AlertDialog
        open={showDispatchConfirm}
        onOpenChange={setShowDispatchConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Dispatch Window?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>This will change when drivers start seeing trip requests:</p>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    • Intra-state (same-state) requests become visible{" "}
                    <strong>
                      {Number(
                        dispatch.intraStateDispatchWindowHours || 0
                      ).toLocaleString()}{" "}
                      hours
                    </strong>{" "}
                    before pickup
                  </li>
                  <li>
                    • Inter-state (cross-state) requests become visible{" "}
                    <strong>
                      {Number(
                        dispatch.interStateDispatchWindowHours || 0
                      ).toLocaleString()}{" "}
                      hours
                    </strong>{" "}
                    before pickup
                  </li>
                </ul>
                {Number(dispatch.interStateDispatchWindowHours) <
                  Number(dispatch.intraStateDispatchWindowHours) && (
                  <p className="mt-3 text-sm text-amber-600 font-medium flex items-start gap-1.5">
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                    Inter-state window is smaller than intra-state — drivers
                    would see cross-state trips for less time than same-state
                    trips. Confirm this is intentional.
                  </p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirmingDispatch}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={confirmDispatchSave}
              disabled={isConfirmingDispatch}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {isConfirmingDispatch ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Confirm Save"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TripRequestSettings;