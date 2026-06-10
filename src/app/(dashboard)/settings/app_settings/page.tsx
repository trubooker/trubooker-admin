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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import {
  useGetAppSettingsQuery,
  useUpdateAppSettingsMutation,
  useGetVersionHistoryQuery,
} from "@/redux/services/Slices/settings/appSettingsApiSlice";
import {
  History,
  AlertTriangle,
  RefreshCw,
  User,
  Car,
  Smartphone,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlatformSettings {
  minVersion: string;
  latestVersion: string;
  isForceUpdate: boolean;
  updateMessage: string;
  isEnabled: boolean;
}

// Matches the backend UpdateAppVersionDto exactly
interface UpdateAppVersionDto {
  appType: "passenger" | "driver";
  platform: "android" | "ios";
  minVersion: string;
  latestVersion: string;
  isForceUpdate: boolean;
  isEnabled: boolean;
  updateMessage: string | null;
}

type AppType = "passenger" | "driver";
type Platform = "android" | "ios";


const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  minVersion: "1.0.0",
  latestVersion: "1.0.0",
  isForceUpdate: false,
  updateMessage: "",
  isEnabled: true,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const validateVersion = (version: string): boolean =>
  /^\d+\.\d+\.\d+$/.test((version ?? "").trim());

// Map API response (nested snake_case) → local state
const fromApi = (raw: any): PlatformSettings => ({
  minVersion: raw?.min_version ?? raw?.minVersion ?? "1.0.0",
  latestVersion: raw?.latest_version ?? raw?.latestVersion ?? "1.0.0",
  isForceUpdate: raw?.is_force_update ?? raw?.isForceUpdate ?? false,
  updateMessage: raw?.update_message ?? raw?.updateMessage ?? "",
  isEnabled: raw?.is_enabled ?? raw?.isEnabled ?? true,
});

// Build a single flat DTO for one combo — matches backend exactly
const toDto = (
  app: AppType,
  platform: Platform,
  s: PlatformSettings
): UpdateAppVersionDto => ({
  appType: app,
  platform,
  minVersion: s.minVersion.trim() || "1.0.0",
  latestVersion: s.latestVersion.trim() || "1.0.0",
  isForceUpdate: s.isForceUpdate,
  isEnabled: s.isEnabled,
  updateMessage: s.updateMessage.trim() || null,
});

// ─── Component ────────────────────────────────────────────────────────────────

const AppSettings = () => {
  const [activeApp, setActiveApp] = useState<AppType>("passenger");
  const [activePlatform, setActivePlatform] = useState<Platform>("android");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingDtos, setPendingDtos] = useState<UpdateAppVersionDto[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  const [settings, setSettings] = useState<Record<string, PlatformSettings>>({
    "passenger-android": { ...DEFAULT_PLATFORM_SETTINGS },
    "passenger-ios": { ...DEFAULT_PLATFORM_SETTINGS },
    "driver-android": { ...DEFAULT_PLATFORM_SETTINGS },
    "driver-ios": { ...DEFAULT_PLATFORM_SETTINGS },
  });

  // ── Queries ──────────────────────────────────────────────────────────────────

  const { data: settingsData, isLoading, refetch } = useGetAppSettingsQuery(null);
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();
  const { data: historyData, isLoading: historyLoading } = useGetVersionHistoryQuery({
    app_type: activeApp,
    platform: activePlatform,
    limit: 10,
  });

  console.log('history data', historyData)

  // ── Seed form from API ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!settingsData?.data) return;
    const d = settingsData.data;
    setSettings({
      "passenger-android": fromApi(d?.passenger?.android),
      "passenger-ios": fromApi(d?.passenger?.ios),
      "driver-android": fromApi(d?.driver?.android),
      "driver-ios": fromApi(d?.driver?.ios),
    });
  }, [settingsData]);

  // ── State helpers ─────────────────────────────────────────────────────────────

  const getSettings = (app: AppType, platform: Platform): PlatformSettings =>
    settings[`${app}-${platform}`] ?? { ...DEFAULT_PLATFORM_SETTINGS };

  const patchSettings = (
    app: AppType,
    platform: Platform,
    field: keyof PlatformSettings,
    value: any
  ) =>
    setSettings((prev) => ({
      ...prev,
      [`${app}-${platform}`]: { ...prev[`${app}-${platform}`], [field]: value },
    }));

  // ── Validate + stage (active tab only) ───────────────────────────────────────

  const handleSubmit = () => {
    const s = getSettings(activeApp, activePlatform);

    if (!validateVersion(s.minVersion) || !validateVersion(s.latestVersion)) {
      toast.error("Version must be in format 1.0.0", {
        duration: 4000,
        position: "top-right",
      });
      return;
    }

    const dto = toDto(activeApp, activePlatform, s);
    console.log("[AppSettings] staged DTO:", dto);
    setPendingDtos([dto]);
    setShowConfirmDialog(true);
  };

  // ── Fire single request for active tab ───────────────────────────────────────

  const confirmUpdate = async () => {
    if (!pendingDtos.length || isConfirming) return;
    setIsConfirming(true);

    const dto = pendingDtos[0];
    console.log("[AppSettings] posting DTO:", dto);

    try {
      await updateSettings(dto).unwrap();
      setIsConfirming(false);
      setShowConfirmDialog(false);
      setPendingDtos([]);
      toast.success(
        `${dto.appType} / ${dto.platform} updated! ✅`,
        { duration: 4000, position: "top-right", icon: "🚀" }
      );
      refetch();
    } catch (err: any) {
      setIsConfirming(false);
      setShowConfirmDialog(false);
      setPendingDtos([]);
      console.error("[AppSettings] update failed:", err);
      const serverMsg: string =
        err?.data?.errors?.join(", ") ??
        err?.data?.message ??
        "Update failed — check console";
      toast.error(serverMsg, {
        duration: 8000,
        position: "top-right",
      });
    }
  };

  // ── Per-platform form ─────────────────────────────────────────────────────────

  const renderPlatformForm = (app: AppType, platform: Platform) => {
    const s = getSettings(app, platform);
    const patch = (field: keyof PlatformSettings, value: any) =>
      patchSettings(app, platform, field, value);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor={`${app}-${platform}-min`}>Minimum Required Version</Label>
            <Input
              id={`${app}-${platform}-min`}
              placeholder="e.g., 1.4.0"
              value={s.minVersion}
              onChange={(e) => patch("minVersion", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Users below this version will be prompted to update
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${app}-${platform}-latest`}>Latest Version</Label>
            <Input
              id={`${app}-${platform}-latest`}
              placeholder="e.g., 1.4.0"
              value={s.latestVersion}
              onChange={(e) => patch("latestVersion", e.target.value)}
            />
            <p className="text-xs text-gray-500">
              Newest version on the{" "}
              {platform === "android" ? "Play Store" : "App Store"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${app}-${platform}-msg`}>Update Message (Optional)</Label>
          <Input
            id={`${app}-${platform}-msg`}
            placeholder="What's new in this update?"
            value={s.updateMessage}
            onChange={(e) => patch("updateMessage", e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor={`${app}-${platform}-force`} className="text-base font-medium">
              Force Update
            </Label>
            <p className="text-sm text-gray-500">
              Block app usage until user updates to minimum version
            </p>
          </div>
          <Switch
            id={`${app}-${platform}-force`}
            checked={s.isForceUpdate}
            onCheckedChange={(v) => patch("isForceUpdate", v)}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <Label htmlFor={`${app}-${platform}-enabled`} className="text-base font-medium">
              Enable Updates
            </Label>
            <p className="text-sm text-gray-500">Temporarily disable update checks</p>
          </div>
          <Switch
            id={`${app}-${platform}-enabled`}
            checked={s.isEnabled}
            onCheckedChange={(v) => patch("isEnabled", v)}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800">Current Status</h4>
              <p className="text-sm text-blue-700 mt-1">
                {s.isEnabled ? (
                  <>
                    {app === "passenger" ? "Passengers" : "Drivers"} on v
                    {s.minVersion} and above can use the app.
                    {s.isForceUpdate && (
                      <span className="font-semibold block mt-1">
                        ⚠️ Force update is ON — users below v{s.minVersion} are
                        blocked.
                      </span>
                    )}
                  </>
                ) : (
                  "Update checks are disabled."
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Confirm dialog warnings ───────────────────────────────────────────────────

  const forceWarnings = pendingDtos.filter((d) => d.isForceUpdate);

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">App Version Manager</h2>
          <p className="text-gray-500">
            Control which app versions your users need to update to
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              toast.success("Settings refreshed!", {
                duration: 2000,
                position: "top-right",
              });
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isUpdating || isLoading || isConfirming}
            className="bg-[--primary] hover:bg-[--primary-btn]"
          >
            {isUpdating || isConfirming ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Main Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>App Version Settings</CardTitle>
          <CardDescription>
            Configure minimum required versions and update behaviour for each app and platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeApp} onValueChange={(v) => setActiveApp(v as AppType)}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="passenger" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Passenger App
              </TabsTrigger>
              <TabsTrigger value="driver" className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                Driver App
              </TabsTrigger>
            </TabsList>

            {(["passenger", "driver"] as AppType[]).map((app) => (
              <TabsContent key={app} value={app}>
                <Tabs
                  value={activePlatform}
                  onValueChange={(v) => setActivePlatform(v as Platform)}
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="android" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Android
                    </TabsTrigger>
                    <TabsTrigger value="ios" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      iOS
                    </TabsTrigger>
                  </TabsList>

                  {(["android", "ios"] as Platform[]).map((platform) => (
                    <TabsContent key={platform} value={platform}>
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-24 w-full" />
                        </div>
                      ) : (
                        renderPlatformForm(app, platform)
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Version History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Version Update History
          </CardTitle>
          <CardDescription>Recent changes to app version requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <ScrollArea className="w-full">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>App</TableHead>
                      <TableHead>Platform</TableHead>
                      <TableHead>Min Version</TableHead>
                      <TableHead>Latest</TableHead>
                      <TableHead>Force</TableHead>
                      <TableHead>Updated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {historyData?.result?.data?.length > 0 ? (
                      historyData.result.data.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm whitespace-nowrap">
                            {formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.app_type === "passenger" ? "default" : "secondary"
                              }
                            >
                              {item.app_type === "passenger" ? "Passenger" : "Driver"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.platform === "android" ? "default" : "secondary"
                              }
                            >
                              {item.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>v{item.minVersion}</TableCell>
                          <TableCell>v{item.latestVersion}</TableCell>
                          <TableCell>
                            {item.isForceUpdate ? (
                              <Badge variant="destructive">Force</Badge>
                            ) : (
                              <Badge variant="outline">Optional</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.updatedBy ?? item.createdBy ?? "System"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No version history available for {activeApp} / {activePlatform}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update App Version Settings?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <p>
                  This will update{" "}
                  <strong>
                    {pendingDtos[0]?.appType} / {pendingDtos[0]?.platform}
                  </strong>{" "}
                  only. Switch tabs to update other combinations.
                </p>
                {forceWarnings.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {forceWarnings.map((d) => (
                      <p
                        key={`${d.appType}-${d.platform}`}
                        className="text-sm text-red-600 font-medium"
                      >
                        ⚠️ {d.appType}/{d.platform.toUpperCase()} — users below v
                        {d.minVersion} will be blocked.
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isConfirming}>Cancel</AlertDialogCancel>
            {/* Plain Button, NOT AlertDialogAction, to avoid implicit form submit */}
            <Button
              onClick={confirmUpdate}
              disabled={isConfirming}
              className="bg-[--primary] hover:bg-[--primary-btn]"
            >
              {isConfirming ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving…
                </>
              ) : (
                "Confirm Update"
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppSettings;
// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import toast from "react-hot-toast";
// import {
//   useGetAppSettingsQuery,
//   useUpdateAppSettingsMutation,
//   useGetVersionHistoryQuery,
// } from "@/redux/services/Slices/settings/appSettingsApiSlice";
// import {
//   Smartphone,
//   Download,
//   History,
//   AlertTriangle,
//   CheckCircle2,
//   Clock,
//   Globe,
//   Users,
//   Sparkles,
//   Target,
//   Calendar,
//   ArrowLeftRight,
//   RefreshCw,
//   User,
//   Car,
// } from "lucide-react";
// import { formatDistanceToNow } from "date-fns";

// const AppSettings = () => {
//   const [activeApp, setActiveApp] = useState<"passenger" | "driver">("passenger");
//   const [activePlatform, setActivePlatform] = useState<"android" | "ios">("android");
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);
//   const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  
//   // Form state for passenger app
//   const [passengerAndroidSettings, setPassengerAndroidSettings] = useState({
//     minVersion: "",
//     latestVersion: "",
//     isForceUpdate: false,
//     updateMessage: "",
//     isEnabled: true,
//   });
  
//   const [passengerIosSettings, setPassengerIosSettings] = useState({
//     minVersion: "",
//     latestVersion: "",
//     isForceUpdate: false,
//     updateMessage: "",
//     isEnabled: true,
//   });

//   // Form state for driver app
//   const [driverAndroidSettings, setDriverAndroidSettings] = useState({
//     minVersion: "",
//     latestVersion: "",
//     isForceUpdate: false,
//     updateMessage: "",
//     isEnabled: true,
//   });
  
//   const [driverIosSettings, setDriverIosSettings] = useState({
//     minVersion: "",
//     latestVersion: "",
//     isForceUpdate: false,
//     updateMessage: "",
//     isEnabled: true,
//   });

//   // Fetch current settings
//   const { data: settingsData, isLoading, refetch } = useGetAppSettingsQuery(null);
//   const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();
//   const { data: historyData, isLoading: historyLoading } = useGetVersionHistoryQuery({
//     app_type: activeApp, // Add this to filter history by app type
//     platform: activePlatform,
//     limit: 10,
//   });

//   useEffect(() => {
//     if (settingsData?.data) {
//       // Passenger app settings
//       const passengerAndroid = settingsData.data.passenger?.android || {};
//       const passengerIos = settingsData.data.passenger?.ios || {};
      
//       setPassengerAndroidSettings({
//         minVersion: passengerAndroid.min_version || "1.0.0",
//         latestVersion: passengerAndroid.latest_version || "1.0.0",
//         isForceUpdate: passengerAndroid.is_force_update || false,
//         updateMessage: passengerAndroid.update_message || "",
//         isEnabled: passengerAndroid.is_enabled !== false,
//       });
      
//       setPassengerIosSettings({
//         minVersion: passengerIos.min_version || "1.0.0",
//         latestVersion: passengerIos.latest_version || "1.0.0",
//         isForceUpdate: passengerIos.is_force_update || false,
//         updateMessage: passengerIos.update_message || "",
//         isEnabled: passengerIos.is_enabled !== false,
//       });

//       // Driver app settings
//       const driverAndroid = settingsData.data.driver?.android || {};
//       const driverIos = settingsData.data.driver?.ios || {};
      
//       setDriverAndroidSettings({
//         minVersion: driverAndroid.min_version || "1.0.0",
//         latestVersion: driverAndroid.latest_version || "1.0.0",
//         isForceUpdate: driverAndroid.is_force_update || false,
//         updateMessage: driverAndroid.update_message || "",
//         isEnabled: driverAndroid.is_enabled !== false,
//       });
      
//       setDriverIosSettings({
//         minVersion: driverIos.min_version || "1.0.0",
//         latestVersion: driverIos.latest_version || "1.0.0",
//         isForceUpdate: driverIos.is_force_update || false,
//         updateMessage: driverIos.update_message || "",
//         isEnabled: driverIos.is_enabled !== false,
//       });
//     }
//   }, [settingsData]);

//   const handlePassengerChange = (platform: "android" | "ios", field: string, value: any) => {
//     if (platform === "android") {
//       setPassengerAndroidSettings((prev) => ({ ...prev, [field]: value }));
//     } else {
//       setPassengerIosSettings((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const handleDriverChange = (platform: "android" | "ios", field: string, value: any) => {
//     if (platform === "android") {
//       setDriverAndroidSettings((prev) => ({ ...prev, [field]: value }));
//     } else {
//       setDriverIosSettings((prev) => ({ ...prev, [field]: value }));
//     }
//   };

//   const validateVersion = (version: string) => {
//     const trimmed = version?.trim() || "";
//     const pattern = /^\d+\.\d+\.\d+$/;
//     return pattern.test(trimmed);
//   };

//   const handleSubmit = async () => {
//     // Get current settings based on active app
//     const androidSettings = activeApp === "passenger" ? passengerAndroidSettings : driverAndroidSettings;
//     const iosSettings = activeApp === "passenger" ? passengerIosSettings : driverIosSettings;

//     // Ensure we have default values if empty
//     const androidMin = androidSettings.minVersion?.trim() || "1.0.0";
//     const androidLatest = androidSettings.latestVersion?.trim() || "1.0.0";
//     const iosMin = iosSettings.minVersion?.trim() || "1.0.0";
//     const iosLatest = iosSettings.latestVersion?.trim() || "1.0.0";
    
//     if (!validateVersion(androidMin) || 
//         !validateVersion(androidLatest) ||
//         !validateVersion(iosMin) ||
//         !validateVersion(iosLatest)) {
//       toast.error("Versions must be in format: 1.0.0", {
//         duration: 4000,
//         position: 'top-right',
//       });
//       return;
//     }

//     // Create payload with all fields for both apps
//     const payload = {
//       passenger: {
//         android: {
//           min_version: activeApp === "passenger" ? androidMin : passengerAndroidSettings.minVersion?.trim() || "1.0.0",
//           latest_version: activeApp === "passenger" ? androidLatest : passengerAndroidSettings.latestVersion?.trim() || "1.0.0",
//           is_force_update: activeApp === "passenger" ? androidSettings.isForceUpdate : passengerAndroidSettings.isForceUpdate,
//           update_message: activeApp === "passenger" ? androidSettings.updateMessage || null : passengerAndroidSettings.updateMessage || null,
//           is_enabled: activeApp === "passenger" ? androidSettings.isEnabled : passengerAndroidSettings.isEnabled,
//         },
//         ios: {
//           min_version: activeApp === "passenger" ? iosMin : passengerIosSettings.minVersion?.trim() || "1.0.0",
//           latest_version: activeApp === "passenger" ? iosLatest : passengerIosSettings.latestVersion?.trim() || "1.0.0",
//           is_force_update: activeApp === "passenger" ? iosSettings.isForceUpdate : passengerIosSettings.isForceUpdate,
//           update_message: activeApp === "passenger" ? iosSettings.updateMessage || null : passengerIosSettings.updateMessage || null,
//           is_enabled: activeApp === "passenger" ? iosSettings.isEnabled : passengerIosSettings.isEnabled,
//         },
//       },
//       driver: {
//         android: {
//           min_version: activeApp === "driver" ? androidMin : driverAndroidSettings.minVersion?.trim() || "1.0.0",
//           latest_version: activeApp === "driver" ? androidLatest : driverAndroidSettings.latestVersion?.trim() || "1.0.0",
//           is_force_update: activeApp === "driver" ? androidSettings.isForceUpdate : driverAndroidSettings.isForceUpdate,
//           update_message: activeApp === "driver" ? androidSettings.updateMessage || null : driverAndroidSettings.updateMessage || null,
//           is_enabled: activeApp === "driver" ? androidSettings.isEnabled : driverAndroidSettings.isEnabled,
//         },
//         ios: {
//           min_version: activeApp === "driver" ? iosMin : driverIosSettings.minVersion?.trim() || "1.0.0",
//           latest_version: activeApp === "driver" ? iosLatest : driverIosSettings.latestVersion?.trim() || "1.0.0",
//           is_force_update: activeApp === "driver" ? iosSettings.isForceUpdate : driverIosSettings.isForceUpdate,
//           update_message: activeApp === "driver" ? iosSettings.updateMessage || null : driverIosSettings.updateMessage || null,
//           is_enabled: activeApp === "driver" ? iosSettings.isEnabled : driverIosSettings.isEnabled,
//         },
//       },
//     };

//     setPendingUpdate(payload);
//     setShowConfirmDialog(true);
//   };

//   const confirmUpdate = async () => {
//     console.log("confirmUpdate fired", pendingUpdate); 
//     try {
//       await updateSettings(pendingUpdate).unwrap();
//       toast.success("App version settings updated successfully! ✅", {
//         duration: 4000,
//         position: 'top-right',
//         icon: '🚀',
//       });
//       refetch();
//     } catch (error: any) {
//       toast.error(error?.data?.message || "Failed to update app settings", {
//         duration: 4000,
//         position: 'top-right',
//       });
//     } finally {
//       setShowConfirmDialog(false);
//       setPendingUpdate(null);
//     }
//   };

//   const renderPlatformSettings = (appType: "passenger" | "driver") => {
//     const androidSettings = appType === "passenger" ? passengerAndroidSettings : driverAndroidSettings;
//     const iosSettings = appType === "passenger" ? passengerIosSettings : driverIosSettings;
//     const handleChange = appType === "passenger" ? handlePassengerChange : handleDriverChange;

//     return (
//       <Tabs value={activePlatform} onValueChange={(v: any) => setActivePlatform(v)}>
//         <TabsList className="grid w-full grid-cols-2 mb-6">
//           <TabsTrigger value="android" className="flex items-center gap-2">
//             <Smartphone className="h-4 w-4" />
//             Android
//           </TabsTrigger>
//           <TabsTrigger value="ios" className="flex items-center gap-2">
//             <Smartphone className="h-4 w-4" />
//             iOS
//           </TabsTrigger>
//         </TabsList>

//         {/* Android Tab */}
//         <TabsContent value="android" className="space-y-6">
//           {isLoading ? (
//             <div className="space-y-4">
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-24 w-full" />
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor={`${appType}-android-min-version`}>Minimum Required Version</Label>
//                   <Input
//                     id={`${appType}-android-min-version`}
//                     placeholder="e.g., 1.4.0"
//                     value={androidSettings.minVersion}
//                     onChange={(e) => handleChange("android", "minVersion", e.target.value)}
//                   />
//                   <p className="text-xs text-gray-500">
//                     Users below this version will be prompted to update
//                   </p>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`${appType}-android-latest-version`}>Latest Version</Label>
//                   <Input
//                     id={`${appType}-android-latest-version`}
//                     placeholder="e.g., 1.4.0"
//                     value={androidSettings.latestVersion}
//                     onChange={(e) => handleChange("android", "latestVersion", e.target.value)}
//                   />
//                   <p className="text-xs text-gray-500">
//                     The newest version available on Play Store
//                   </p>
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor={`${appType}-android-update-message`}>Update Message (Optional)</Label>
//                 <Input
//                   id={`${appType}-android-update-message`}
//                   placeholder="What's new in this update?"
//                   value={androidSettings.updateMessage}
//                   onChange={(e) => handleChange("android", "updateMessage", e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="space-y-1">
//                   <Label htmlFor={`${appType}-android-force-update`} className="text-base font-medium">
//                     Force Update
//                   </Label>
//                   <p className="text-sm text-gray-500">
//                     Block app usage until user updates to minimum version
//                   </p>
//                 </div>
//                 <Switch
//                   id={`${appType}-android-force-update`}
//                   checked={androidSettings.isForceUpdate}
//                   onCheckedChange={(checked) => handleChange("android", "isForceUpdate", checked)}
//                 />
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="space-y-1">
//                   <Label htmlFor={`${appType}-android-enabled`} className="text-base font-medium">
//                     Enable Updates
//                   </Label>
//                   <p className="text-sm text-gray-500">
//                     Temporarily disable update checks
//                   </p>
//                 </div>
//                 <Switch
//                   id={`${appType}-android-enabled`}
//                   checked={androidSettings.isEnabled}
//                   onCheckedChange={(checked) => handleChange("android", "isEnabled", checked)}
//                 />
//               </div>

//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <div className="flex items-start gap-3">
//                   <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-medium text-blue-800">Current Status</h4>
//                     <p className="text-sm text-blue-700 mt-1">
//                       {androidSettings.isEnabled ? (
//                         <>
//                           {appType === "passenger" ? "Passengers" : "Drivers"} on v{androidSettings.minVersion} and above can use the app.
//                           {androidSettings.isForceUpdate && (
//                             <span className="font-semibold block mt-1">
//                               ⚠️ Force update is enabled - users below v{androidSettings.minVersion} cannot use the app.
//                             </span>
//                           )}
//                         </>
//                       ) : (
//                         "Update checks are disabled"
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </TabsContent>

//         {/* iOS Tab */}
//         <TabsContent value="ios" className="space-y-6">
//           {isLoading ? (
//             <div className="space-y-4">
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-10 w-full" />
//               <Skeleton className="h-24 w-full" />
//             </div>
//           ) : (
//             <>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor={`${appType}-ios-min-version`}>Minimum Required Version</Label>
//                   <Input
//                     id={`${appType}-ios-min-version`}
//                     placeholder="e.g., 1.4.0"
//                     value={iosSettings.minVersion}
//                     onChange={(e) => handleChange("ios", "minVersion", e.target.value)}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor={`${appType}-ios-latest-version`}>Latest Version</Label>
//                   <Input
//                     id={`${appType}-ios-latest-version`}
//                     placeholder="e.g., 1.4.0"
//                     value={iosSettings.latestVersion}
//                     onChange={(e) => handleChange("ios", "latestVersion", e.target.value)}
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor={`${appType}-ios-update-message`}>Update Message (Optional)</Label>
//                 <Input
//                   id={`${appType}-ios-update-message`}
//                   placeholder="What's new in this update?"
//                   value={iosSettings.updateMessage}
//                   onChange={(e) => handleChange("ios", "updateMessage", e.target.value)}
//                 />
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="space-y-1">
//                   <Label htmlFor={`${appType}-ios-force-update`} className="text-base font-medium">
//                     Force Update
//                   </Label>
//                   <p className="text-sm text-gray-500">
//                     Block app usage until user updates
//                   </p>
//                 </div>
//                 <Switch
//                   id={`${appType}-ios-force-update`}
//                   checked={iosSettings.isForceUpdate}
//                   onCheckedChange={(checked) => handleChange("ios", "isForceUpdate", checked)}
//                 />
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
//                 <div className="space-y-1">
//                   <Label htmlFor={`${appType}-ios-enabled`} className="text-base font-medium">
//                     Enable Updates
//                   </Label>
//                   <p className="text-sm text-gray-500">
//                     Temporarily disable update checks
//                   </p>
//                 </div>
//                 <Switch
//                   id={`${appType}-ios-enabled`}
//                   checked={iosSettings.isEnabled}
//                   onCheckedChange={(checked) => handleChange("ios", "isEnabled", checked)}
//                 />
//               </div>
//             </>
//           )}
//         </TabsContent>
//       </Tabs>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">App Version Manager</h2>
//           <p className="text-gray-500">
//             Control which app versions your users need to update to
//           </p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => {
//               refetch();
//               toast.success('Settings refreshed!', {
//                 duration: 2000,
//                 position: 'top-right',
//               });
//             }}
//             disabled={isLoading}
//           >
//             <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
//             Refresh
//           </Button>
//           <Button
//             size="sm"
//             onClick={handleSubmit}
//             disabled={isUpdating}
//             className="bg-[--primary] hover:bg-[--primary-btn]"
//           >
//             {isUpdating ? (
//               <>
//                 <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                 Saving...
//               </>
//             ) : (
//               "Save Changes"
//             )}
//           </Button>
//         </div>
//       </div>

//       {/* Main Settings Card */}
//       <Card>
//         <CardHeader>
//           <CardTitle>App Version Settings</CardTitle>
//           <CardDescription>
//             Configure minimum required versions and update behavior for each app and platform
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Tabs value={activeApp} onValueChange={(v: any) => setActiveApp(v)}>
//             <TabsList className="grid w-full grid-cols-2 mb-6">
//               <TabsTrigger value="passenger" className="flex items-center gap-2">
//                 <User className="h-4 w-4" />
//                 Passenger App
//               </TabsTrigger>
//               <TabsTrigger value="driver" className="flex items-center gap-2">
//                 <Car className="h-4 w-4" />
//                 Driver App
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="passenger">
//               {renderPlatformSettings("passenger")}
//             </TabsContent>

//             <TabsContent value="driver">
//               {renderPlatformSettings("driver")}
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>

//       {/* Version History */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <History className="h-5 w-5" />
//             Version Update History
//           </CardTitle>
//           <CardDescription>
//             Recent changes to app version requirements
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {historyLoading ? (
//             <div className="space-y-3">
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//               <Skeleton className="h-12 w-full" />
//             </div>
//           ) : (
//             <ScrollArea className="w-full">
//               <div className="min-w-[700px]">
//                 <Table>
//                   <TableHeader>
//                     <TableRow>
//                       <TableHead>Date</TableHead>
//                       <TableHead>App</TableHead>
//                       <TableHead>Platform</TableHead>
//                       <TableHead>Min Version</TableHead>
//                       <TableHead>Latest</TableHead>
//                       <TableHead>Force</TableHead>
//                       <TableHead>Updated By</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {historyData?.data?.length > 0 ? (
//                       historyData.data.map((item: any) => (
//                         <TableRow key={item.id}>
//                           <TableCell className="font-mono text-sm">
//                             {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant={item.app_type === "passenger" ? "default" : "secondary"}>
//                               {item.app_type === "passenger" ? "Passenger" : "Driver"}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>
//                             <Badge variant={item.platform === "android" ? "default" : "secondary"}>
//                               {item.platform}
//                             </Badge>
//                           </TableCell>
//                           <TableCell>v{item.min_version}</TableCell>
//                           <TableCell>v{item.latest_version}</TableCell>
//                           <TableCell>
//                             {item.is_force_update ? (
//                               <Badge variant="destructive">Force</Badge>
//                             ) : (
//                               <Badge variant="outline">Optional</Badge>
//                             )}
//                           </TableCell>
//                           <TableCell>{item.updated_by || "System"}</TableCell>
//                         </TableRow>
//                       ))
//                     ) : (
//                       <TableRow>
//                         <TableCell colSpan={7} className="text-center py-8 text-gray-500">
//                           No version history available
//                         </TableCell>
//                       </TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               </div>
//               <ScrollBar orientation="horizontal" />
//             </ScrollArea>
//           )}
//         </CardContent>
//       </Card>

//       {/* Confirmation Dialog */}
//       <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Update App Version Settings?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will immediately affect all users. 
//               {pendingUpdate?.[activeApp]?.android?.isForceUpdate && (
//                 <span className="block mt-2 text-red-600 font-medium">
//                   ⚠️ {activeApp === "passenger" ? "Passenger" : "Driver"} Android users below v{pendingUpdate[activeApp].android.min_version} will be blocked from using the app.
//                 </span>
//               )}
//               {pendingUpdate?.[activeApp]?.ios?.isForceUpdate && (
//                 <span className="block mt-2 text-red-600 font-medium">
//                   ⚠️ {activeApp === "passenger" ? "Passenger" : "Driver"} iOS users below v{pendingUpdate[activeApp].ios.min_version} will be blocked from using the app.
//                 </span>
//               )}
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={confirmUpdate}>
//               Confirm Update
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default AppSettings;