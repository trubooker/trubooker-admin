// @/components/Settings/EditCouponModal.tsx
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Edit, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateCouponMutation, useGetCouponByIdQuery } from "@/redux/services/Slices/settings/couponApiSlice";
import toast from "react-hot-toast";

// Validation schema
const FormSchema = z.object({
  coupon_code: z.string().min(3, "Coupon code must be at least 3 characters").optional(),
  coupon_type: z.enum(["percentage", "fixed_amount"]),
  coupon_value: z.string().min(1, "Value is required"),
  expiry_date: z.date({
    required_error: "Expiry date is required",
  }),
  max_usage: z.string().min(1, "Max usage is required"),
  max_users: z.string().optional(),
  min_order_amount: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

interface EditCouponModalProps {
  couponId: number;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const EditCouponModal: React.FC<EditCouponModalProps> = ({ couponId, onSuccess, children }) => {
  const [open, setOpen] = React.useState(false);
  
  // Fetch coupon data
  const { data: couponData, isLoading: couponLoading, refetch } = useGetCouponByIdQuery(
    couponId,
    { skip: !open } // Only fetch when modal is open
  );
  
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();

  const coupon = couponData?.data;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      coupon_code: "",
      coupon_type: "percentage",
      coupon_value: "0",
      expiry_date: new Date(),
      max_usage: "1",
      max_users: "",
      min_order_amount: "",
      description: "",
      is_active: true,
    },
  });

  // Populate form when coupon data is loaded
  useEffect(() => {
    if (coupon && open) {
      form.reset({
        coupon_code: coupon.coupon_code || "",
        coupon_type: coupon.coupon_type,
        coupon_value: coupon.coupon_value.toString(),
        expiry_date: new Date(coupon.expiry_date),
        max_usage: coupon.max_usage.toString(),
        max_users: coupon.max_users?.toString() || "",
        min_order_amount: coupon.min_order_amount?.toString() || "",
        description: coupon.description || "",
        is_active: coupon.is_active || true,
      });
    }
  }, [coupon, open, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      // Prepare the update data
      const updateData: any = {
        coupon_type: data.coupon_type,
        coupon_value: Number(data.coupon_value),
        expiry_date: format(data.expiry_date, "yyyy-MM-dd"),
        max_usage: Number(data.max_usage),
        is_active: data.is_active,
      };

      // Add optional fields only if they have values
      if (data.coupon_code && data.coupon_code.trim() !== "") {
        updateData.coupon_code = data.coupon_code;
      }
      
      if (data.max_users && data.max_users.trim() !== "") {
        updateData.max_users = Number(data.max_users);
      }
      
      if (data.min_order_amount && data.min_order_amount.trim() !== "") {
        updateData.min_order_amount = Number(data.min_order_amount);
      }
      
      if (data.description !== undefined) {
        updateData.description = data.description;
      }

      // Update the coupon
      await updateCoupon({
        id: couponId,
        ...updateData
      }).unwrap();

      toast.success("Coupon updated successfully!");
      onSuccess?.();
      refetch(); // Refetch the coupon data
      setOpen(false);
    } catch (error: any) {
      console.error("Update error:", error);
      toast.error(error?.data?.message || error?.data?.errors?.coupon_code?.[0] || "Failed to update coupon");
    }
  };

  const canEdit = coupon?.used_count === 0;

  if (couponLoading && open) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {children || (
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Loading Coupon...
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" disabled={!canEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Coupon
          </DialogTitle>
          <DialogDescription>
            {!canEdit && (
              <div className="text-red-500 bg-red-50 p-2 rounded mt-2 text-sm">
                ⚠️ Cannot edit coupons that have been used. This coupon has been used {coupon?.used_count} times.
              </div>
            )}
            {canEdit && coupon && (
              <div className="text-green-600 bg-green-50 p-2 rounded mt-2 text-sm">
                ✓ This coupon can be edited as it hasn't been used yet.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Coupon Code */}
                <FormField
                  control={form.control}
                  name="coupon_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coupon Code (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Leave empty to keep current code"
                          {...field}
                          disabled={!canEdit}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty to keep current code: <span className="font-mono font-bold">{coupon?.coupon_code}</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          value={field.value}
                          disabled={!canEdit}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="percentage">Percentage (%)</SelectItem>
                            <SelectItem value="fixed_amount">Fixed Amount ($)</SelectItem>
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
                            : "Discount Amount ($) *"}
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
                              disabled={!canEdit}
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
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
                              disabled={!canEdit}
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
                            disabled={!canEdit}
                          />
                        </FormControl>
                        <FormDescription>
                          Times a single user can use this coupon
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
                            placeholder="Leave empty for unlimited"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value || "")}
                            disabled={!canEdit}
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
                          placeholder="Leave empty for no minimum"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value || "")}
                          disabled={!canEdit}
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
                          disabled={!canEdit}
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
                        <FormLabel className="text-base">Active Status</FormLabel>
                        <FormDescription>
                          Enable or disable this coupon
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={!canEdit}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isUpdating || !canEdit}
                    className="bg-[--primary] hover:bg-[--primary-btn] text-white"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCouponModal;