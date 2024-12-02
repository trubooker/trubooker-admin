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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IoPersonOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { LuDiamond } from "react-icons/lu";
import toast from "react-hot-toast";
import fetchToken from "@/lib/auth";
import { useLoggedInUser } from "@/hooks/useLoggedUser";
import Spinner from "@/components/Spinner";
import { FaSpinner } from "react-icons/fa";
import { set } from "lodash";
import LogoutModal from "@/components/LogoutModal";

const FormSchema = z.object({
  first_name: z.string().min(1, { message: "Required" }),
  last_name: z.string().min(1, { message: "Required" }),
  email: z.string({
    required_error: "Please select an email to display.",
  }),
  phone_number: z.string().min(1, { message: "Required" }),
  password: z
    .string()
    .min(6, { message: "Password must be 6 characters or more" }),
  new_password: z
    .string()
    .min(6, { message: "Password must be 6 characters or more" }),
});

const Settings = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [previewSrc, setPreviewSrc] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openLog, setOpenLog] = React.useState(false);
  const { userData } = useLoggedInUser();

  const handleFileChange = async (e: any) => {
    const file = e.target.files?.[0];

    if (file) {
      const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];

      if (validImageTypes.includes(file.type)) {
        const reader = new FileReader();

        reader.onloadend = () => {
          setPreviewSrc(reader.result as string);
        };

        reader.readAsDataURL(file);
        setSelectedFile(file);
      } else {
        toast.error("Please upload a valid image file (JPEG, JPG, or PNG)");
        setPreviewSrc("");
      }
    } else {
      setPreviewSrc("");
    }
  };

  const handleUploadPicture = async () => {
    setLoading(true);

    try {
      if (selectedFile) {
        const formdata = new FormData();
        selectedFile && formdata.append("profile_image", selectedFile);

        const token = await fetchToken();
        const headers = {
          Authorization: `Bearer ${token?.data?.token}`,
          Accept: "application/json",
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload-profile-picture`,
          {
            method: "POST",
            headers,
            body: formdata,
          }
        );

        const resdata = await res.json();
        if (resdata?.status == "success") {
          setLoading(false);
        }
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    alert("clicked");
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setLoading(false);
    }, 3000);
  };

  const handleLogout = () => {
    setOpenLog(true);
  };

  return (
    <div>
      <LogoutModal open={openLog} setOpen={setOpenLog} />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <div className="flex justify-between items-center mb-5">
              <div className="font-bold text-lg">Basic Settings</div>
              <span className="flex gap-x-2">
                {/* <Button variant={"outline"} size="sm">
                  Cancel
                </Button> */}
                <Button
                  type="submit"
                  disabled={loading}
                  variant={"outline"}
                  size={"sm"}
                  className="bg-[--primary] text-white hover:text-white hover:bg-[--primary-btn]"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin w-8 h-8" size={24} />
                    </>
                  ) : (
                    "Update"
                  )}
                </Button>
              </span>
            </div>
            <div className="bg-white rounded-xl p-5">
              <div className="flex flex-col lg:flex-row items-center p-5 gap-3">
                <Avatar className="w-40 h-40">
                  <AvatarImage
                    src={previewSrc ? previewSrc : userData?.profile_image}
                  />
                  <AvatarFallback>
                    <IoPersonOutline className="h-14 w-14" />
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col lg:flex-row gap-2">
                  <label
                    htmlFor="fileInput"
                    className="py-2 px-5 rounded-lg text-[13px] cursor-pointer border hover:bg-gray-100"
                  >
                    Upload new
                    <input
                      type="file"
                      id="fileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                  {previewSrc ? (
                    <div
                      onClick={handleUploadPicture}
                      className="bg-[--primary] text-white hover:text-white hover:bg-[--primary-btn] py-2 px-5 rounded-lg text-[13px] text-center cursor-pointer"
                    >
                      Upload Picture
                    </div>
                  ) : (
                    ""
                  )}
                </span>
              </div>

              <Separator />

              <Card className="border-none shadow-none lg:p-5 py-5">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg text-gray-500">
                    Personal information
                  </CardTitle>
                  <CardDescription>
                    Configure key trip parameters to ensure smooth operations
                    and flexibility for passengers and drivers
                  </CardDescription>
                </CardHeader>
                <CardContent className="border-none px-0 rounded-lg">
                  <div className="grid gap-4">
                    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="John"
                                  className="py-6"
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
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input
                                  type="text"
                                  placeholder="Doe"
                                  className="py-6"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  // disabled
                                  placeholder="johndoe@gmail.com"
                                  className="py-6"
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
                          name="phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input
                                  type="tel"
                                  placeholder="+234 3456 5678 90"
                                  className="py-6"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <Card className="border-none shadow-none lg:p-5 py-5">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg text-gray-500">
                    Password
                  </CardTitle>
                  <CardDescription>
                    Modify your current password
                  </CardDescription>
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
                              <FormMessage />
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
                              <FormMessage />
                              {passwordError && (
                                <FormMessage>{passwordError}</FormMessage>
                              )}
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              <Card className="border-none shadow-none lg:p-5 py-5">
                <CardHeader className="px-0">
                  <CardTitle className="text-lg text-gray-500">
                    Account Security
                  </CardTitle>
                  <CardDescription>
                    Manage your account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="border-none px-0 rounded-lg">
                  <span className="flex flex-col lg:flex-row gap-5">
                    <div
                      onClick={handleLogout}
                      className="py-2 px-5 lg:w-32 rounded-lg text-[13px] cursor-pointer border hover:bg-gray-100"
                    >
                      <span className="flex gap-x-3 justify-center items-center">
                        <LuDiamond />
                        Log Out
                      </span>
                    </div>
                    <div
                      onClick={handleDeleteAccount}
                      className="bg-[#B3261E] text-white hover:text-white hover:bg-[#C45650] py-2 px-5 rounded-lg text-[13px] cursor-pointer"
                    >
                      <span className="flex gap-x-3 justify-center  items-center">
                        <LuDiamond />
                        Delete my account
                      </span>
                    </div>
                  </span>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Settings;
