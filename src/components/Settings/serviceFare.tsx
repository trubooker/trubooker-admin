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
import { useSetPriceControlMutation } from "@/redux/services/Slices/settings/referralProgramApiSlice";
import toast from "react-hot-toast";

const FormSchema = z.object({
  base_trip_fare: z.string().min(1, { message: "Required" }),
  driver_Earning_percentage: z.string().min(1, { message: "Required" }),
  agent_earning_percentage: z.string().min(1, { message: "Required" }),
});

const PriceControl = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [setPrice, { isLoading }] = useSetPriceControlMutation();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formdata = {
      base_trip_fare: Number(data.base_trip_fare),
      driver_earning_percentage: Number(data.driver_Earning_percentage),
      agent_earning_percentage: Number(data.agent_earning_percentage),
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
                Price Control
              </CardTitle>
            </CardHeader>
            <CardContent className="border-none px-0 rounded-lg">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="base_trip_fare"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Base Trip Fare</FormLabel>
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
                    name="driver_Earning_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver Earning Percentage</FormLabel>
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
                    name="agent_earning_percentage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connector Earning Percentage</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0%" {...field} />
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
                  {isLoading ? "Setting..." : "Set Price"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default PriceControl;
