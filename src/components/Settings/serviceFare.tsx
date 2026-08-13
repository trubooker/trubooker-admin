"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSetPriceControlMutation } from "@/redux/services/Slices/settings/referralProgramApiSlice";
import toast from "react-hot-toast";


const FormSchema = z.object({
  minTripPrice: z.string().min(1, { message: "Required" }),
  driverEarningRate: z.string().min(1, { message: "Required" }),
  // agent_earning: z.string().min(1, { message: "Required" }),
  agentEarningAmount: z.string().min(1, { message: "Required" }),
  agent_earning_percentage: z.string().min(1, { message: "Required" }),
});

const PriceControl = ({ price_control }: any) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [setPrice, { isLoading }] = useSetPriceControlMutation();



  useEffect(() => {
    if (price_control) {
      form.reset({
        minTripPrice: String(price_control?.value?.minTripPrice),
        driverEarningRate: String(
          price_control?.value?.driverEarningRate
        ),
        agentEarningAmount: String(
          price_control?.value?.agentEarningAmount
        ),
        agent_earning_percentage: String(
          price_control?.value?.agentEarningAmount
        ),
      });
    }
  }, [price_control, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formdata = {
      minTripPrice: Number(
        data.minTripPrice || price_control?.value?.minTripPrice
      ),
      driverEarningRate: Number(
        data.driverEarningRate ||
          price_control?.value?.driverEarningRate
      ),
      // ...(agentEarningType === "percentage"
      //   ? { agent_earning_percentage: Number(data.agent_earning  ||
      // price_control?.value?.agent_earning_percentage) }
      //   : { agent_earning_amount: Number(data.agent_earning || price_control?.value?.agent_earning_amount) }),

      agentEarningAmount: Number(
        data.agentEarningAmount || price_control?.value?.agentEarningAmount
      ),
      agent_earning_percentage: Number(
        data.agent_earning_percentage ||
          price_control?.value?.agent_earning_percentage
      ),
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
                    name="minTripPrice"
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
                    name="driverEarningRate"
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
                {/* <div className="grid gap-2 relative">
                  <FormField
                    control={form.control}
                    name="agent_earning"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Connector Earning</FormLabel>
                          <Select
                            value={agentEarningType}
                            onValueChange={(value) =>
                              setAgentEarningType(
                                value as "percentage" | "amount"
                              )
                            }
                          >
                            <SelectTrigger className="w-20">
                              <span>
                                {agentEarningType === "amount" ? "₦" : "%"}
                              </span>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="amount">Amount</SelectItem>
                              <SelectItem value="percentage">
                                Percentage
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder={
                              agentEarningType === "percentage" ? "0%" : "0"
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div> */}
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
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="agentEarningAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Connector Earning Amount</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" {...field} />
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
