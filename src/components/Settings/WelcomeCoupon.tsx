"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSetWelcomeCouponSettingsMutation, useGetWelcomeCouponSettingsQuery } from "@/redux/services/Slices/settings/couponApiSlice";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

const FormSchema = z.object({
  coupon_type: z.enum(["percentage", "fixed_amount"]),
  coupon_value: z.string().min(1, "Value is required"),
  expiry_days: z.string().min(1, "Expiry days required"),
  usage_limit: z.string().min(1, "Usage limit required"),
  min_order_amount: z.string().optional(),
  coupon_code: z.string().optional(),
});

const WelcomeCoupon = () => {
  const [isCustomCode, setIsCustomCode] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [couponType, setCouponType] = useState<"percentage" | "fixed_amount">("percentage");
  
  const { data: welcomeCouponData, isLoading: loading, refetch } = useGetWelcomeCouponSettingsQuery(null);
  const [setWelcomeCoupon, { isLoading }] = useSetWelcomeCouponSettingsMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coupon_type: "percentage",
      coupon_value: "10",
      expiry_days: "30",
      usage_limit: "1",
      min_order_amount: "",
    },
  });

  useEffect(() => {
    if (welcomeCouponData?.data?.value) {
      const data = welcomeCouponData.data.value;
      setIsEnabled(data.is_enabled || false);
      setCouponType(data.coupon_type || "percentage");
      form.reset({
        coupon_type: data.coupon_type || "percentage",
        coupon_value: String(data.coupon_value || "10"),
        expiry_days: String(data.expiry_days || "30"),
        usage_limit: String(data.usage_limit || "1"),
        min_order_amount: data.min_order_amount ? String(data.min_order_amount) : "",
        coupon_code: data.coupon_code || "",
      });
      setIsCustomCode(!!data.coupon_code && !data.is_auto_generated);
    }
  }, [welcomeCouponData, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formData = {
        is_enabled: isEnabled,
        coupon_type: data.coupon_type,
        coupon_value: Number(data.coupon_value),
        expiry_days: Number(data.expiry_days),
        usage_limit: Number(data.usage_limit),
        min_order_amount: data.min_order_amount ? Number(data.min_order_amount) : null,
        coupon_code: isCustomCode ? data.coupon_code : null,
        is_auto_generated: !isCustomCode,
      };

      await setWelcomeCoupon(formData).unwrap();
      toast.success("Welcome coupon settings saved successfully");
      refetch();
    } catch (error) {
      toast.error("Error saving settings");
      console.error("Error saving welcome coupon settings:", error);
    }
  };

  const handleToggleEnable = async (checked: boolean) => {
    try {
      setIsEnabled(checked);
      
      // If we're disabling, save immediately
      if (!checked) {
        const currentData = form.getValues();
        const formData = {
          is_enabled: false,
          coupon_type: currentData.coupon_type,
          coupon_value: Number(currentData.coupon_value),
          expiry_days: Number(currentData.expiry_days),
          usage_limit: Number(currentData.usage_limit),
          min_order_amount: currentData.min_order_amount ? Number(currentData.min_order_amount) : null,
          coupon_code: isCustomCode ? currentData.coupon_code : null,
          is_auto_generated: !isCustomCode,
        };
        
        await setWelcomeCoupon(formData).unwrap();
        toast.success("Welcome coupon disabled");
        refetch();
      }
    } catch (error) {
      setIsEnabled(!checked); // Revert on error
      toast.error("Error updating settings");
      console.error("Error toggling welcome coupon:", error);
    }
  };

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "WELCOME";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("coupon_code", code);
  };

  return (
    <Card className="border-none shadow-none p-5">
      <CardHeader className="px-0">
        <CardTitle className="text-lg text-gray-500">
          First-Time User Welcome Coupon
        </CardTitle>
        <CardDescription>
          Configure coupon settings for new passenger registrations
        </CardDescription>
      </CardHeader>
      <CardContent className="border-none px-0 rounded-lg">
        {/* Enable/Disable Switch - Separate from form */}
        <div className="flex flex-row items-center justify-between rounded-lg border p-4 mb-6">
          <div className="space-y-0.5">
            <Label className="text-base">
              Enable Welcome Coupon
            </Label>
            <p className="text-sm text-muted-foreground">
              Automatically give coupon to new passengers on registration
            </p>
          </div>
          <div className="relative">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleToggleEnable}
              disabled={loading || isLoading}
              className={cn(
                "data-[state=checked]:bg-blue-600", // Blue when active
                "data-[state=unchecked]:bg-gray-300", // Gray when inactive
                "hover:data-[state=checked]:bg-blue-700",
                "hover:data-[state=unchecked]:bg-gray-400"
              )}
            />
            {/* Status indicator text */}
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs">
              <span className={cn(
                "font-medium",
                isEnabled ? "text-blue-600" : "text-gray-500"
              )}>
                {isEnabled ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {isEnabled ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Coupon Code */}
              <div className="grid gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Label>Coupon Code</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomCode(false)}
                      className={cn(
                        !isCustomCode 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      Auto Generate
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCustomCode(true)}
                      className={cn(
                        isCustomCode 
                          ? "bg-blue-600 text-white hover:bg-blue-700" 
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      Custom Code
                    </Button>
                  </div>
                </div>

                {isCustomCode ? (
                  <FormField
                    control={form.control}
                    name="coupon_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter custom coupon code"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="flex-1 w-full">
                      <FormField
                        control={form.control}
                        name="coupon_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Auto-generated code"
                                {...field}
                                value={field.value || "WELCOME******"}
                                disabled
                                className="bg-gray-50"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={generateRandomCode}
                      className="w-full sm:w-auto bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                    >
                      Generate
                    </Button>
                  </div>
                )}
              </div>

              {/* Coupon Type and Value */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="coupon_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Type</FormLabel>
                      <Select
                        onValueChange={(value: "percentage" | "fixed_amount") => {
                          field.onChange(value);
                          setCouponType(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={cn(
                            couponType === "percentage" 
                              ? "border-blue-200 focus:ring-blue-500" 
                              : "border-blue-200 focus:ring-blue-500"
                          )}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="percentage">
                            Percentage (%)
                          </SelectItem>
                          <SelectItem value="fixed_amount">
                            Fixed Amount
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coupon_value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {couponType === "percentage"
                          ? "Discount Percentage"
                          : "Discount Amount"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder={
                              couponType === "percentage"
                                ? "10"
                                : "50"
                            }
                            {...field}
                            className="pr-10"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className={cn(
                              "font-medium",
                              couponType === "percentage" ? "text-blue-600" : "text-blue-600"
                            )}>
                              {couponType === "percentage" ? "%" : ""}
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Expiry and Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiry_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry (Days)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="30"
                            {...field}
                            className="pr-10"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">days</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Days after registration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="usage_limit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Usage Limit</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="number"
                            placeholder="1"
                            {...field}
                            className="pr-10"
                          />
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className="text-gray-500">times</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        How many times can be used
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Minimum Order Amount */}
              <FormField
                control={form.control}
                name="min_order_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Amount (Optional)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="No minimum"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                          className="pr-10"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Minimum ride fare required to use coupon
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEnabled(false);
                    handleToggleEnable(false);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center p-6 sm:p-8 border rounded-lg bg-gray-50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 mb-4">
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-gray-500 mb-4">
              Welcome coupon is currently disabled. Enable it to configure settings.
            </p>
            <Button
              onClick={() => setIsEnabled(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Enable Welcome Coupon
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WelcomeCoupon;