"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useUpdatePasswordMutation } from "@/redux/services/Slices/userApiSlice";
import toast from "react-hot-toast";

const FormSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be 6 characters or more" }),
    new_password: z
      .string()
      .min(6, { message: "Password must be 6 characters or more" }),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.new_password_confirmation, {
    message: "Passwords must match",
    path: ["new_password_confirmation"],
  });

const UpdatePassword = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const [submitPassword, { isLoading }] = useUpdatePasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setNewPasswordError("");
    setPasswordError("");
    await submitPassword({
      current_password: data.password,
      password: data.new_password,
      password_confirmation: data?.new_password_confirmation,
    })
      .unwrap()
      .then((res) => {
        form.setValue("password", "");
        form.setValue("new_password", "");
        console.log(res);

        toast.success("Password is updated! Login again");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      })
      .catch((error: any) => {
        console.log(error);
        setPasswordError(error?.data?.error?.message);
        setNewPasswordError(
          error?.data?.errors?.password.map((err: any, index: number) => (
            <div key={index}>
              <ul className="list-disc list-inside">
                <li>{err}</li>
              </ul>
            </div>
          ))
        );
      });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="border-none shadow-none lg:p-5 py-5">
            <CardHeader className="px-0">
              <CardTitle className="text-lg text-gray-500">Password</CardTitle>
              <CardDescription>Modify your current password</CardDescription>
            </CardHeader>
            <CardContent className="border-none px-0 rounded-lg">
              <div className="grid gap-4">
                <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Current Password"
                                className="py-6"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="text-xs font-semibold underline absolute right-4 top-5"
                              >
                                {showPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </FormControl>
                          {!passwordError ? <FormMessage /> : ""}
                          {passwordError && (
                            <FormMessage>{passwordError}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showNewPassword ? "text" : "password"}
                                placeholder="Enter New Password"
                                className="py-6"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                className="text-xs font-semibold underline absolute right-4 top-5"
                              >
                                {showNewPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </FormControl>
                          {!newPasswordError ? <FormMessage /> : ""}
                          {newPasswordError && (
                            <FormMessage>{newPasswordError}</FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="new_password_confirmation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                id="password"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Enter New Password"
                                className="py-6"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="text-xs font-semibold underline absolute right-4 top-5"
                              >
                                {showConfirmPassword ? "Hide" : "Show"}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    variant="default"
                    type="submit"
                    disabled={isLoading}
                    className="bg-[--primary] text-white hover:text-white mt-auto py-6 hover:bg-[--primary-btn] w-full"
                  >
                    {isLoading ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default UpdatePassword;
