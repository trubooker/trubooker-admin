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
import React, { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useGenerateCouponMutation } from "@/redux/services/Slices/settings/couponApiSlice";
import toast from "react-hot-toast";

const FormSchema = z.object({
  coupon_code: z.string().min(3, "Coupon code must be at least 3 characters"),
  coupon_type: z.enum(["percentage", "fixed_amount"]),
  coupon_value: z.string().min(1, "Value is required"),
  expiry_date: z.date({
    required_error: "Expiry date is required",
  }),
  max_usage: z.string().min(1, "Max usage is required"),
  max_users: z.string().optional(),
  min_order_amount: z.string().optional(),
  is_active: z.boolean().default(true),
  description: z.string().optional(),
});

const CouponGenerator = () => {
  const [isCustomCode, setIsCustomCode] = useState(true);
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  
  const [generateCoupon, { isLoading }] = useGenerateCouponMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coupon_code: "",
      coupon_type: "percentage",
      coupon_value: "10",
      expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      max_usage: "1",
      max_users: "",
      min_order_amount: "",
      is_active: true,
      description: "",
    },
  });

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "PROMO";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    form.setValue("coupon_code", code);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      ...data,
      coupon_value: Number(data.coupon_value),
      max_usage: Number(data.max_usage),
      max_users: data.max_users ? Number(data.max_users) : null,
      min_order_amount: data.min_order_amount ? Number(data.min_order_amount) : null,
      expiry_date: format(data.expiry_date, "yyyy-MM-dd"),
    };

    await generateCoupon(formData)
      .unwrap()
      .then((response) => {
        toast.success("Coupon generated successfully!");
        setGeneratedCoupon(data.coupon_code);
        form.reset();
        // Show success with coupon code
        toast.success(`Coupon Code: ${data.coupon_code}`, {
          duration: 5000,
        });
      })
      .catch((err) => {
        toast.error("Error generating coupon");
      });
  };

  return (
    <Card className="border-none shadow-none p-5">
      <CardHeader className="px-0">
        <CardTitle className="text-lg text-gray-500">
          Generate Promotion Coupon
        </CardTitle>
        <CardDescription>
          Create coupon codes to share with passengers
        </CardDescription>
      </CardHeader>
      <CardContent className="border-none px-0 rounded-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Coupon Code Input */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <FormLabel>Coupon Code *</FormLabel>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCustomCode(true);
                      form.setValue("coupon_code", "");
                    }}
                    className={isCustomCode ? "bg-primary text-white" : ""}
                  >
                    Custom Code
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsCustomCode(false);
                      generateRandomCode();
                    }}
                    className={!isCustomCode ? "bg-primary text-white" : ""}
                  >
                    Auto Generate
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="coupon_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Enter coupon code"
                            {...field}
                            disabled={!isCustomCode}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!isCustomCode && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateRandomCode}
                  >
                    Regenerate
                  </Button>
                )}
              </div>
            </div>

            {/* Coupon Type and Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="coupon_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                      {form.watch("coupon_type") === "percentage"
                        ? "Discount Percentage *"
                        : "Discount Amount *"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={
                            form.watch("coupon_type") === "percentage"
                              ? "10"
                              : "50"
                          }
                          {...field}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                          {form.watch("coupon_type") === "percentage"
                            ? "%"
                            : "$"}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Expiry Date */}
            <FormField
              control={form.control}
              name="expiry_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Expiry Date *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Coupon will expire at the end of this day
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="max_usage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses Per User *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Times a single user can use this
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_users"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Total Users (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Unlimited"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || "")}
                      />
                    </FormControl>
                    <FormDescription>
                      Limit total number of users who can use
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
                    <Input
                      type="number"
                      placeholder="No minimum"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value || "")}
                    />
                  </FormControl>
                  <FormDescription>
                    Minimum ride fare required to use coupon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter coupon description or notes"
                      {...field}
                      rows={3}
                    />
                  </FormControl>
                  <FormDescription>
                    Internal notes about this coupon
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Active Status
                    </FormLabel>
                    <FormDescription>
                      Enable or disable this coupon
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[--primary] hover:bg-[--primary-btn] text-white py-2 px-4 rounded-md w-full"
            >
              {isLoading ? "Generating..." : "Generate Coupon"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CouponGenerator;