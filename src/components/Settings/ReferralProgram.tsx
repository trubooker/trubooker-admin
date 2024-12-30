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
import { useSetReferralProgramMutation } from "@/redux/services/Slices/settings/referralProgramApiSlice";
import toast from "react-hot-toast";

const FormSchema = z.object({
  coupon_value: z.string().min(1, { message: "Required" }),
  validity_period: z.string().min(1, { message: "Required" }),
  no_of_referrals: z.string().min(1, { message: "Required" }),
  usage_limit: z.enum(["once", "multiple"], {
    required_error: "You need to select one.",
  }),
});

const ReferralProgram = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [setPrice, { isLoading }] = useSetReferralProgramMutation();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formdata = {
      coupon_value: Number(data.coupon_value),
      validity_period: Number(data.validity_period),
      no_of_referrals: Number(data.no_of_referrals),
      usage_limit: data.usage_limit,
    };
    await setPrice(formdata)
      .unwrap()
      .then((res) => {
        toast.success("Success");
      })
      .catch((err) => {
        toast.error("Error occured");
      });
  };
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="no_of_referrals"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of referrals required</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="coupon_value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Coupon Value (%)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="validity_period"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Validity Period</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="usage_limit"
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
                                  value="once"
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
                                  value="multiple"
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
                  className="bg-[--primary] hover:bg-[--primary-btn] text-white py-2 px-4 rounded-md"
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
