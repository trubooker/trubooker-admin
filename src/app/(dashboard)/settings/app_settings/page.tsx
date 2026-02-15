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
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AppSettings = () => {
  const [activePlatform, setActivePlatform] = useState<"android" | "ios">("android");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<any>(null);
  
  // Form state
  const [androidSettings, setAndroidSettings] = useState({
    minVersion: "",
    latestVersion: "",
    isForceUpdate: false,
    updateMessage: "",
    isEnabled: true,
  });
  
  const [iosSettings, setIosSettings] = useState({
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
    platform: activePlatform,
    limit: 10,
  });

useEffect(() => {
  if (settingsData?.data) {
    const android = settingsData.data.android || {};
    const ios = settingsData.data.ios || {};
    
    setAndroidSettings({
      minVersion: android.min_version || "1.0.0",
      latestVersion: android.latest_version || "1.0.0",
      isForceUpdate: android.is_force_update || false,
      updateMessage: android.update_message || "",
      isEnabled: android.is_enabled !== false,
    });
    
    setIosSettings({
      // ✅ FIX: Add fallback values!
      minVersion: ios.min_version || "1.0.0",  // If empty, use "1.0.0"
      latestVersion: ios.latest_version || "1.0.0",  // If empty, use "1.0.0"
      isForceUpdate: ios.is_force_update || false,
      updateMessage: ios.update_message || "",
      isEnabled: ios.is_enabled !== false,
    });
  }
}, [settingsData]);


  const handleAndroidChange = (field: string, value: any) => {
    setAndroidSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleIosChange = (field: string, value: any) => {
    setIosSettings((prev) => ({ ...prev, [field]: value }));
  };
const validateVersion = (version: string) => {
  // Trim whitespace first
  const trimmed = version?.trim() || "";
  
  // Pattern for version like 1.0.0, 2.3.4, 10.20.30
  const pattern = /^\d+\.\d+\.\d+$/;
  
  console.log("Validating:", trimmed, "Result:", pattern.test(trimmed));
  
  return pattern.test(trimmed);
};

const handleSubmit = async () => {
  // Ensure we have default values if empty
  const androidMin = androidSettings.minVersion?.trim() || "1.0.0";
  const androidLatest = androidSettings.latestVersion?.trim() || "1.0.0";
  const iosMin = iosSettings.minVersion?.trim() || "1.0.0";  // FIX
  const iosLatest = iosSettings.latestVersion?.trim() || "1.0.0"; // FIX
  
  console.log("=== VALIDATION DEBUG ===");
  console.log("Android minVersion:", androidMin);
  console.log("Android latestVersion:", androidLatest);
  console.log("iOS minVersion:", iosMin);
  console.log("iOS latestVersion:", iosLatest);
  
  if (!validateVersion(androidMin) || 
      !validateVersion(androidLatest) ||
      !validateVersion(iosMin) ||  // Now won't be empty
      !validateVersion(iosLatest)) {  // Now won't be empty
    toast.error("Versions must be in format: 1.0.0", {
      duration: 4000,
      position: 'top-right',
    });
    return;
  }

  // Create payload with all fields
  const payload = {
    android: {
      min_version: androidMin,
      latest_version: androidLatest,
      is_force_update: androidSettings.isForceUpdate,
      update_message: androidSettings.updateMessage || null,
      is_enabled: androidSettings.isEnabled,
    },
    ios: {
      min_version: iosMin,
      latest_version: iosLatest,
      is_force_update: iosSettings.isForceUpdate,
      update_message: iosSettings.updateMessage || null,
      is_enabled: iosSettings.isEnabled,
    },
  };

  console.log("Submitting payload:", payload);
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
            Configure minimum required versions and update behavior for each platform
          </CardDescription>
        </CardHeader>
        <CardContent>
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
                      <Label htmlFor="android-min-version">Minimum Required Version</Label>
                      <Input
                        id="android-min-version"
                        placeholder="e.g., 1.4.0"
                        value={androidSettings.minVersion}
                        onChange={(e) => handleAndroidChange("minVersion", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        Users below this version will be prompted to update
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="android-latest-version">Latest Version</Label>
                      <Input
                        id="android-latest-version"
                        placeholder="e.g., 1.4.0"
                        value={androidSettings.latestVersion}
                        onChange={(e) => handleAndroidChange("latestVersion", e.target.value)}
                      />
                      <p className="text-xs text-gray-500">
                        The newest version available on Play Store
                      </p>
                    </div>
                  </div>

                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="android-force-update" className="text-base font-medium">
                        Force Update
                      </Label>
                      <p className="text-sm text-gray-500">
                        Block app usage until user updates to minimum version
                      </p>
                    </div>
                    <Switch
                      id="android-force-update"
                      checked={androidSettings.isForceUpdate}
                      onCheckedChange={(checked) => handleAndroidChange("isForceUpdate", checked)}
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
                              Users on v{androidSettings.minVersion} and above can use the app.
                              {androidSettings.isForceUpdate && (
                                <span className="font-semibold block mt-1">
                                  ⚠️ Force update is enabled - users below v{androidSettings.minVersion} cannot use the app.
                                </span>
                              )}
                            </>
                          ) : (
                            "Update checks are disabled for Android"
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
                      <Label htmlFor="ios-min-version">Minimum Required Version</Label>
                      <Input
                        id="ios-min-version"
                        placeholder="e.g., 1.4.0"
                        value={iosSettings.minVersion}
                        onChange={(e) => handleIosChange("minVersion", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ios-latest-version">Latest Version</Label>
                      <Input
                        id="ios-latest-version"
                        placeholder="e.g., 1.4.0"
                        value={iosSettings.latestVersion}
                        onChange={(e) => handleIosChange("latestVersion", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ios-update-message">Update Message (Optional)</Label>
                    <Input
                      id="ios-update-message"
                      placeholder="What's new in this update?"
                      value={iosSettings.updateMessage}
                      onChange={(e) => handleIosChange("updateMessage", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="ios-force-update" className="text-base font-medium">
                        Force Update
                      </Label>
                      <p className="text-sm text-gray-500">
                        Block app usage until user updates
                      </p>
                    </div>
                    <Switch
                      id="ios-force-update"
                      checked={iosSettings.isForceUpdate}
                      onCheckedChange={(checked) => handleIosChange("isForceUpdate", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-1">
                      <Label htmlFor="ios-enabled" className="text-base font-medium">
                        Enable Updates
                      </Label>
                      <p className="text-sm text-gray-500">
                        Temporarily disable update checks for iOS
                      </p>
                    </div>
                    <Switch
                      id="ios-enabled"
                      checked={iosSettings.isEnabled}
                      onCheckedChange={(checked) => handleIosChange("isEnabled", checked)}
                    />
                  </div>
                </>
              )}
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
              <div className="min-w-[600px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
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
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
              {pendingUpdate?.android?.isForceUpdate && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ Android users below v{pendingUpdate.android.minVersion} will be blocked from using the app.
                </span>
              )}
              {pendingUpdate?.ios?.isForceUpdate && (
                <span className="block mt-2 text-red-600 font-medium">
                  ⚠️ iOS users below v{pendingUpdate.ios.minVersion} will be blocked from using the app.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogCancel onClick={confirmUpdate}>
              Confirm Update
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AppSettings;