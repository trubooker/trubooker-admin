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
  useSetPerKmRateMutation,
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
  MapPin,
  Route,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PerKmRateForm {
  intraStatePerKmRate: string;
  interStatePerKmRate: string;
}

interface DispatchWindowForm {
  intraStateDispatchWindowHours: string;
  interStateDispatchWindowHours: string;
}

const DEFAULT_PER_KM: PerKmRateForm = {
  intraStatePerKmRate: "",
  interStatePerKmRate: "",
};

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

  if (Array.isArray(data?.message)) return data.message.join("; ");
  if (typeof data?.message === "string") return data.message;

  if (typeof err?.error === "string") return err.error;

  return fallback;
};

// Convert any value to a form-friendly string; "" when absent
const toInputString = (val: unknown): string =>
  val !== undefined && val !== null && val !== "" ? String(val) : "";

// Format currency for display
const formatNaira = (val: string | number): string =>
  Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─── Component ────────────────────────────────────────────────────────────────

const TripRequestSettings = () => {
  // ── Per km rate state ────────────────────────────────────────────────────
  const [perKm, setPerKm] = useState<PerKmRateForm>(DEFAULT_PER_KM);
  const [showRateConfirm, setShowRateConfirm] = useState(false);
  const [isConfirmingRate, setIsConfirmingRate] = useState(false);

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

  const [setPerKmRate, { isLoading: isSettingRate }] =
    useSetPerKmRateMutation();

  const [updateDispatchWindow, { isLoading: isUpdatingDispatch }] =
    useUpdateDispatchWindowMutation();

  // ── Extract price_control entry ──────────────────────────────────────────

  const priceControl = systemSettingsData?.result?.find(
    (entry: { key: string }) => entry.key === "price_control"
  );

  // ── Seed local state from get-all ────────────────────────────────────────

  useEffect(() => {
    if (!priceControl?.value) return;
    const v = priceControl.value;

    // Legacy single fallback (in case backend hasn't migrated yet)
    const fallbackRate = v.perKmRate ?? v.pricePerKm ?? "";

    setPerKm({
      intraStatePerKmRate: toInputString(
        v.intraStatePerKmRate ?? fallbackRate
      ),
      interStatePerKmRate: toInputString(
        v.interStatePerKmRate ?? fallbackRate
      ),
    });

    setDispatch({
      intraStateDispatchWindowHours: toInputString(
        v.intraStateDispatchWindowHours
      ),
      interStateDispatchWindowHours: toInputString(
        v.interStateDispatchWindowHours
      ),
    });
  }, [priceControl]);

  const rateBusy = isSettingRate || isConfirmingRate;
  const dispatchBusy = isUpdatingDispatch || isConfirmingDispatch;

  const patchPerKm = (field: keyof PerKmRateForm, value: string) =>
    setPerKm((prev) => ({ ...prev, [field]: value }));

  const patchDispatch = (field: keyof DispatchWindowForm, value: string) =>
    setDispatch((prev) => ({ ...prev, [field]: value }));

  // ── Per km rate handlers ─────────────────────────────────────────────────

  const handleRateSaveClick = () => {
    const intraRaw = perKm.intraStatePerKmRate.trim();
    const interRaw = perKm.interStatePerKmRate.trim();

    if (!intraRaw) {
      toast.error("Intra-state rate is required", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    const intra = Number(intraRaw);
    if (isNaN(intra) || intra <= 0) {
      toast.error("Intra-state rate must be greater than 0", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    if (!interRaw) {
      toast.error("Inter-state rate is required", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }
    const inter = Number(interRaw);
    if (isNaN(inter) || inter <= 0) {
      toast.error("Inter-state rate must be greater than 0", {
        position: "top-right",
        duration: 4000,
      });
      return;
    }

    setShowRateConfirm(true);
  };

  const confirmRateSave = async () => {
    if (isConfirmingRate) return;
    setIsConfirmingRate(true);

    const payload = {
      intraStatePerKmRate: Number(perKm.intraStatePerKmRate),
      interStatePerKmRate: Number(perKm.interStatePerKmRate),
    };

    try {
      await setPerKmRate(payload).unwrap();
      setIsConfirmingRate(false);
      setShowRateConfirm(false);
      toast.success("Per-km rates updated ✅", {
        position: "top-right",
        duration: 4000,
        icon: "💰",
      });
    } catch (e: any) {
      setIsConfirmingRate(false);
      setShowRateConfirm(false);
      toast.error(
        extractErrorMessage(e, "Failed to update per-km rates"),
        { position: "top-right", duration: 8000 }
      );
    }
  };

  // ── Dispatch handlers ────────────────────────────────────────────────────

  const handleDispatchSaveClick = () => {
    const intraRaw = dispatch.intraStateDispatchWindowHours.trim();
    const interRaw = dispatch.interStateDispatchWindowHours.trim();

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

      {/* ── Per Km Rate Card ────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Price Per Kilometer
              </CardTitle>
              <CardDescription>
                Set the per-kilometer rate for intra-state and inter-state
                trips
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={handleRateSaveClick}
              disabled={rateBusy || isLoading}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {rateBusy ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Rates
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
                  <Label htmlFor="intra-rate">Intra-State Rate (per km)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      ₦
                    </span>
                    <Input
                      id="intra-rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 315"
                      value={perKm.intraStatePerKmRate}
                      onChange={(e) =>
                        patchPerKm("intraStatePerKmRate", e.target.value)
                      }
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Rate for trips within the same state
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inter-rate">Inter-State Rate (per km)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">
                      ₦
                    </span>
                    <Input
                      id="inter-rate"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="e.g., 200"
                      value={perKm.interStatePerKmRate}
                      onChange={(e) =>
                        patchPerKm("interStatePerKmRate", e.target.value)
                      }
                      className="pl-8"
                    />
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Route className="h-3 w-3" />
                    Rate for trips between states
                  </p>
                </div>
              </div>

              {perKm.intraStatePerKmRate && perKm.interStatePerKmRate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-800">
                        Current Rates
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        <strong>Same-state:</strong> ₦
                        {formatNaira(perKm.intraStatePerKmRate)} / km ·{" "}
                        <strong>Cross-state:</strong> ₦
                        {formatNaira(perKm.interStatePerKmRate)} / km
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

      {/* Rate Confirm */}
      <AlertDialog open={showRateConfirm} onOpenChange={setShowRateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save Per-Km Rates?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>This will update the per-kilometer rates:</p>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>
                    • Intra-state:{" "}
                    <strong>
                      ₦{formatNaira(perKm.intraStatePerKmRate)}
                    </strong>{" "}
                    per km
                  </li>
                  <li>
                    • Inter-state:{" "}
                    <strong>
                      ₦{formatNaira(perKm.interStatePerKmRate)}
                    </strong>{" "}
                    per km
                  </li>
                </ul>
                <p className="mt-3 text-sm text-amber-600 font-medium flex items-start gap-1.5">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  New rates apply immediately to all new trips.
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirmingRate}>
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={confirmRateSave}
              disabled={isConfirmingRate}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {isConfirmingRate ? (
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