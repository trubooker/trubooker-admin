"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginComponent() {
  const LoginFormSchema = z.object({
    email: z
      .string()
      .email({ message: "Email is invalid" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be 8 characters or more" })
      .max(15, { message: "Password too long" }),
  });
  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  // const [serverError, setServerError] = useState("");
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [loading, setLoading] = useState(false); // Loading state for button

  const onSubmit = async (data: z.infer<typeof LoginFormSchema>) => {
    setLoading(true); // Show loading state
    router.push("/dashboard");
    // try {
    //   const response = await axios.post(`/api/login`, data);

    //   if (response.status === 200) {
    //     form.setValue("email", "");
    //     form.setValue("password", "");

    //     toast.success("Login Successful!", {
    //       position: "top-center",
    //       autoClose: 2000,
    //       hideProgressBar: false,
    //       closeOnClick: true,
    //       pauseOnHover: true,
    //       draggable: true,
    //       progress: undefined,
    //       theme: "light",
    //       transition: Bounce,
    //     });
    //   }
    // } catch (error: any) {
    //   setLoading(false);
    //   toast.error(error.data.msg, {
    //     position: "top-center",
    //     autoClose: 2000,
    //     hideProgressBar: true,
    //     theme: "light",
    //   });
    //   form.setValue("email", "");
    //   form.setValue("password", "");
    // }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="h-screen flex flex-col  bg-[#F8F7F7] justify-center ">
      <Card className="mx-auto w-11/12 bg-white lg:w-4/12">
        <div className=" w-full">
          <Image
            src={"/logo.svg"}
            width="150"
            height="150"
            alt="Logo"
            className="mx-auto text-center mt-10"
          />
        </div>
        <CardHeader>
          <CardTitle className="text-xl text-center gap-y-3 flex flex-col text-gray-500">
            Welcome to Trubooker
            <span className="text-xs text-gray-400">
              Please sign-in to your admin account
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <div className="grid gap-8 text-gray-500">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            type="email"
                            {...field}
                            className="py-6"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2 text-gray-500">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              {...field}
                              className="py-6"
                            />

                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="text-xs font-semibold underline absolute right-4 top-4"
                            >
                              {showPassword ? (
                                <FaEyeSlash className="w-4 h-4" />
                              ) : (
                                <FaEye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <div className="flex items-center justify-end">
                          <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-gray-500 text-sm"
                          >
                            Forgot your password?
                          </Link>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full text-white bg-[--primary] hover:bg-[--primary-btn] hover:text-white"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Log in"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
