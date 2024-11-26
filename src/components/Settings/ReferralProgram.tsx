"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import Link from "next/link";

const FormSchema = z.object({
  coupon: z.string().min(1, { message: "Required" }),
  validity: z.string().min(1, { message: "Required" }),
  referrals: z.string().min(1, { message: "Required" }),
  usageLimit: z.enum(["One-Time", "Multiple"], {
    required_error: "You need to select one.",
  }),
});

const ReferralProgram = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const isLoading: boolean = false;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {};
  return (
    <div className=" rounded-3xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-none p-5">
            <CardHeader className="px-0">
              <CardTitle className="text-lg text-gray-500">
                Configure Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent className="border-none px-0 rounded-lg">
              <div className="grid gap-4">
                {/* <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a verified email to display" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="m@example.com">
                              m@example.com
                            </SelectItem>
                            <SelectItem value="m@google.com">
                              m@google.com
                            </SelectItem>
                            <SelectItem value="m@support.com">
                              m@support.com
                            </SelectItem>
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="referrals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of referrals required</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="coupon"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Value (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0%"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="validity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity Period</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="usageLimit"
                    render={({ field }) => (
                      <FormItem className="">
                        <FormLabel>Usage Limit</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 mt-0 "
                          >
                            <FormItem className="flex items-center border rounded-lg space-x-3 space-y-0 p-4">
                              <FormControl>
                                <RadioGroupItem
                                  className="border-muted-foreground h-5 w-5"
                                  value="One-Time"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-base text-muted-foreground">
                                One-time
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 border rounded-lg p-4 space-y-0">
                              <FormControl>
                                <RadioGroupItem
                                  className="border-muted-foreground h-5 w-5"
                                  value="Multiple"
                                />
                              </FormControl>
                              <FormLabel className="font-normal text-base text-muted-foreground">
                                Multiple
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[--primary] hover:bg-[--primary-hover] text-white py-2 px-4 rounded-md"
                >
                  {isLoading ? "Activating..." : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default ReferralProgram;
