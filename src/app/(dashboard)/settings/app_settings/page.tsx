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
  AlertDialogAction,
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
  Smartphone,
  Download,
  History,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Globe,
  Users,
  Sparkles,
  Target,
  Calendar,
  ArrowLeftRight,
  RefreshCw,
  User,
  Car,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AppSettings = () => {
  const [activeApp, setActiveApp] = useState<"passenger" | "driver">("passenger");
  const [activePlatform, setActivePlatform] = useState<"android" | "ios">("android");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  
  // Form state for passenger app
  const [passengerAndroidSettings, setPassengerAndroidSettings] = useState({
    minVersion: "",
    latestVersion: "",
    isForceUpdate: false,
    updateMessage: "",
    isEnabled: true,
  });
  
  const [passengerIosSettings, setPassengerIosSettings] = useState({
    minVersion: "",
    latestVersion: "",
    isForceUpdate: false,
    updateMessage: "",
    isEnabled: true,
  });

  // Form state for driver app
  const [driverAndroidSettings, setDriverAndroidSettings] = useState({
    minVersion: "",
    latestVersion: "",
    isForceUpdate: false,
    updateMessage: "",
    isEnabled: true,
  });
  
  const [driverIosSettings, setDriverIosSettings] = useState({
    minVersion: "",
    latestVersion: "",
    isForceUpdate: false,
    updateMessage: "",
    isEnabled: true,
  });

  // Fetch current settings
  const { data: settingsData, isLoading, refetch } = useGetAppSettingsQuery(null);
  const [updateSettings, { isLoading: isUpdating }] = useUpdateAppSettingsMutation();
  const { data: historyData, isLoading: historyLoading } = useGetVersionHistoryQuery({
    app_type: activeApp, // Add this to filter history by app type
    platform: activePlatform,
    limit: 10,
  });

  useEffect(() => {
    if (settingsData?.data) {
      // Passenger app settings
      const passengerAndroid = settingsData.data.passenger?.android || {};
      const passengerIos = settingsData.data.passenger?.ios || {};
      
      setPassengerAndroidSettings({
        minVersion: passengerAndroid.min_version || "1.0.0",
        latestVersion: passengerAndroid.latest_version || "1.0.0",
        isForceUpdate: passengerAndroid.is_force_update || false,
        updateMessage: passengerAndroid.update_message || "",
        isEnabled: passengerAndroid.is_enabled !== false,
      });
      
      setPassengerIosSettings({
        minVersion: passengerIos.min_version || "1.0.0",
        latestVersion: passengerIos.latest_version || "1.0.0",
        isForceUpdate: passengerIos.is_force_update || false,
        updateMessage: passengerIos.update_message || "",
        isEnabled: passengerIos.is_enabled !== false,
      });

      // Driver app settings
      const driverAndroid = settingsData.data.driver?.android || {};
      const driverIos = settingsData.data.driver?.ios || {};
      
      setDriverAndroidSettings({
        minVersion: driverAndroid.min_version || "1.0.0",
        latestVersion: driverAndroid.latest_version || "1.0.0",
        isForceUpdate: driverAndroid.is_force_update || false,
        updateMessage: driverAndroid.update_message || "",
        isEnabled: driverAndroid.is_enabled !== false,
      });
      
      setDriverIosSettings({
        minVersion: driverIos.min_version || "1.0.0",
        latestVersion: driverIos.latest_version || "1.0.0",
        isForceUpdate: driverIos.is_force_update || false,
        updateMessage: driverIos.update_message || "",
        isEnabled: driverIos.is_enabled !== false,
      });
    }
  }, [settingsData]);

  const handlePassengerChange = (platform: "android" | "ios", field: string, value: any) => {
    if (platform === "android") {
      setPassengerAndroidSettings((prev) => ({ ...prev, [field]: value }));
    } else {
      setPassengerIosSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleDriverChange = (platform: "android" | "ios", field: string, value: any) => {
    if (platform === "android") {
      setDriverAndroidSettings((prev) => ({ ...prev, [field]: value }));
    } else {
      setDriverIosSettings((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validateVersion = (version: string) => {
    const trimmed = version?.trim() || "";
    const pattern = /^\d+\.\d+\.\d+$/;
    return pattern.test(trimmed);
  };

  const handleSubmit = async () => {
    // Get current settings based on active app
    const androidSettings = activeApp === "passenger" ? passengerAndroidSettings : driverAndroidSettings;
    const iosSettings = activeApp === "passenger" ? passengerIosSettings : driverIosSettings;

    // Ensure we have default values if empty
    const androidMin = androidSettings.minVersion?.trim() || "1.0.0";
    const androidLatest = androidSettings.latestVersion?.trim() || "1.0.0";
    const iosMin = iosSettings.minVersion?.trim() || "1.0.0";
    const iosLatest = iosSettings.latestVersion?.trim() || "1.0.0";
    
    if (!validateVersion(androidMin) || 
        !validateVersion(androidLatest) ||
        !validateVersion(iosMin) ||
        !validateVersion(iosLatest)) {
      toast.error("Versions must be in format: 1.0.0", {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    // Create payload with all fields for both apps
    const payload = {
      passenger: {
        android: {
          min_version: activeApp === "passenger" ? androidMin : passengerAndroidSettings.minVersion?.trim() || "1.0.0",
          latest_version: activeApp === "passenger" ? androidLatest : passengerAndroidSettings.latestVersion?.trim() || "1.0.0",
          is_force_update: activeApp === "passenger" ? androidSettings.isForceUpdate : passengerAndroidSettings.isForceUpdate,
          update_message: activeApp === "passenger" ? androidSettings.updateMessage || null : passengerAndroidSettings.updateMessage || null,
          is_enabled: activeApp === "passenger" ? androidSettings.isEnabled : passengerAndroidSettings.isEnabled,
        },
        ios: {
          min_version: activeApp === "passenger" ? iosMin : passengerIosSettings.minVersion?.trim() || "1.0.0",
          latest_version: activeApp === "passenger" ? iosLatest : passengerIosSettings.latestVersion?.trim() || "1.0.0",
          is_force_update: activeApp === "passenger" ? iosSettings.isForceUpdate : passengerIosSettings.isForceUpdate,
          update_message: activeApp === "passenger" ? iosSettings.updateMessage || null : passengerIosSettings.updateMessage || null,
          is_enabled: activeApp === "passenger" ? iosSettings.isEnabled : passengerIosSettings.isEnabled,
        },
      },
      driver: {
        android: {
          min_version: activeApp === "driver" ? androidMin : driverAndroidSettings.minVersion?.trim() || "1.0.0",
          latest_version: activeApp === "driver" ? androidLatest : driverAndroidSettings.latestVersion?.trim() || "1.0.0",
          is_force_update: activeApp === "driver" ? androidSettings.isForceUpdate : driverAndroidSettings.isForceUpdate,
          update_message: activeApp === "driver" ? androidSettings.updateMessage || null : driverAndroidSettings.updateMessage || null,
          is_enabled: activeApp === "driver" ? androidSettings.isEnabled : driverAndroidSettings.isEnabled,
        },
        ios: {
          min_version: activeApp === "driver" ? iosMin : driverIosSettings.minVersion?.trim() || "1.0.0",
          latest_version: activeApp === "driver" ? iosLatest : driverIosSettings.latestVersion?.trim() || "1.0.0",
          is_force_update: activeApp === "driver" ? iosSettings.isForceUpdate : driverIosSettings.isForceUpdate,
          update_message: activeApp === "driver" ? iosSettings.updateMessage || null : driverIosSettings.updateMessage || null,
          is_enabled: activeApp === "driver" ? iosSettings.isEnabled : driverIosSettings.isEnabled,
        },
      },
    };

    setPendingUpdate(payload);
    setShowConfirmDialog(true);
  };

  const confirmUpdate = async () => {
    try {
      await updateSettings(pendingUpdate).unwrap();
      toast.success("App version settings updated successfully! ✅", {
        duration: 4000,
        position: 'top-right',
        icon: '🚀',
      });
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update app settings", {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setShowConfirmDialog(false);
      setPendingUpdate(null);
    }
  };

  const renderPlatformSettings = (appType: "passenger" | "driver") => {
    const androidSettings = appType === "passenger" ? passengerAndroidSettings : driverAndroidSettings;
    const iosSettings = appType === "passenger" ? passengerIosSettings : driverIosSettings;
    const handleChange = appType === "passenger" ? handlePassengerChange : handleDriverChange;

    return (
      <Tabs value={activePlatform} onValueChange={(v: any) => setActivePlatform(v)}>
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

        {/* Android Tab */}
        <TabsContent value="android" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`${appType}-android-min-version`}>Minimum Required Version</Label>
                  <Input
                    id={`${appType}-android-min-version`}
                    placeholder="e.g., 1.4.0"
                    value={androidSettings.minVersion}
                    onChange={(e) => handleChange("android", "minVersion", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    Users below this version will be prompted to update
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${appType}-android-latest-version`}>Latest Version</Label>
                  <Input
                    id={`${appType}-android-latest-version`}
                    placeholder="e.g., 1.4.0"
                    value={androidSettings.latestVersion}
                    onChange={(e) => handleChange("android", "latestVersion", e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    The newest version available on Play Store
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${appType}-android-update-message`}>Update Message (Optional)</Label>
                <Input
                  id={`${appType}-android-update-message`}
                  placeholder="What's new in this update?"
                  value={androidSettings.updateMessage}
                  onChange={(e) => handleChange("android", "updateMessage", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor={`${appType}-android-force-update`} className="text-base font-medium">
                    Force Update
                  </Label>
                  <p className="text-sm text-gray-500">
                    Block app usage until user updates to minimum version
                  </p>
                </div>
                <Switch
                  id={`${appType}-android-force-update`}
                  checked={androidSettings.isForceUpdate}
                  onCheckedChange={(checked) => handleChange("android", "isForceUpdate", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor={`${appType}-android-enabled`} className="text-base font-medium">
                    Enable Updates
                  </Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable update checks
                  </p>
                </div>
                <Switch
                  id={`${appType}-android-enabled`}
                  checked={androidSettings.isEnabled}
                  onCheckedChange={(checked) => handleChange("android", "isEnabled", checked)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Current Status</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {androidSettings.isEnabled ? (
                        <>
                          {appType === "passenger" ? "Passengers" : "Drivers"} on v{androidSettings.minVersion} and above can use the app.
                          {androidSettings.isForceUpdate && (
                            <span className="font-semibold block mt-1">
                              ⚠️ Force update is enabled - users below v{androidSettings.minVersion} cannot use the app.
                            </span>
                          )}
                        </>
                      ) : (
                        "Update checks are disabled"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* iOS Tab */}
        <TabsContent value="ios" className="space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`${appType}-ios-min-version`}>Minimum Required Version</Label>
                  <Input
                    id={`${appType}-ios-min-version`}
                    placeholder="e.g., 1.4.0"
                    value={iosSettings.minVersion}
                    onChange={(e) => handleChange("ios", "minVersion", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`${appType}-ios-latest-version`}>Latest Version</Label>
                  <Input
                    id={`${appType}-ios-latest-version`}
                    placeholder="e.g., 1.4.0"
                    value={iosSettings.latestVersion}
                    onChange={(e) => handleChange("ios", "latestVersion", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${appType}-ios-update-message`}>Update Message (Optional)</Label>
                <Input
                  id={`${appType}-ios-update-message`}
                  placeholder="What's new in this update?"
                  value={iosSettings.updateMessage}
                  onChange={(e) => handleChange("ios", "updateMessage", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor={`${appType}-ios-force-update`} className="text-base font-medium">
                    Force Update
                  </Label>
                  <p className="text-sm text-gray-500">
                    Block app usage until user updates
                  </p>
                </div>
                <Switch
                  id={`${appType}-ios-force-update`}
                  checked={iosSettings.isForceUpdate}
                  onCheckedChange={(checked) => handleChange("ios", "isForceUpdate", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-1">
                  <Label htmlFor={`${appType}-ios-enabled`} className="text-base font-medium">
                    Enable Updates
                  </Label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable update checks
                  </p>
                </div>
                <Switch
                  id={`${appType}-ios-enabled`}
                  checked={iosSettings.isEnabled}
                  onCheckedChange={(checked) => handleChange("ios", "isEnabled", checked)}
                />
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    );
  };

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
              toast.success('Settings refreshed!', {
                duration: 2000,
                position: 'top-right',
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
            disabled={isUpdating}
            className="bg-[--primary] hover:bg-[--primary-btn]"
          >
            {isUpdating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Saving...
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
            Configure minimum required versions and update behavior for each app and platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeApp} onValueChange={(v: any) => setActiveApp(v)}>
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

            <TabsContent value="passenger">
              {renderPlatformSettings("passenger")}
            </TabsContent>

            <TabsContent value="driver">
              {renderPlatformSettings("driver")}
            </TabsContent>
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
          <CardDescription>
            Recent changes to app version requirements
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
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
                    {historyData?.data?.length > 0 ? (
                      historyData.data.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-sm">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.app_type === "passenger" ? "default" : "secondary"}>
                              {item.app_type === "passenger" ? "Passenger" : "Driver"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.platform === "android" ? "default" : "secondary"}>
                              {item.platform}
                            </Badge>
                          </TableCell>
                          <TableCell>v{item.min_version}</TableCell>
                          <TableCell>v{item.latest_version}</TableCell>
                          <TableCell>
                            {item.is_force_update ? (
                              <Badge variant="destructive">Force</Badge>
                            ) : (
                              <Badge variant="outline">Optional</Badge>
                            )}
                          </TableCell>
                          <TableCell>{item.updated_by || "System"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No version history available
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
            <AlertDialogDescription>
              This will immediately affect all users. 
              {pendingUpdate?.[activeApp]?.android?.isForceUpdate && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ {activeApp === "passenger" ? "Passenger" : "Driver"} Android users below v{pendingUpdate[activeApp].android.min_version} will be blocked from using the app.
                </span>
              )}
              {pendingUpdate?.[activeApp]?.ios?.isForceUpdate && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ {activeApp === "passenger" ? "Passenger" : "Driver"} iOS users below v{pendingUpdate[activeApp].ios.min_version} will be blocked from using the app.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmUpdate}>
              Confirm Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppSettings;