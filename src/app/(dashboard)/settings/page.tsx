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
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IoPersonOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { LuDiamond } from "react-icons/lu";
import toast from "react-hot-toast";
import fetchToken from "@/lib/auth";
import { useLoggedInUser } from "@/hooks/useLoggedUser";
import { FaSpinner } from "react-icons/fa";
import LogoutModal from "@/components/LogoutModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUpdateProfileMutation } from "@/redux/services/Slices/userApiSlice";
import UpdatePassword from "@/components/Settings/UpdatePassword";
import ImageUploader from "@/components/ImageUploader";
import { RiDeleteBin6Line } from "react-icons/ri";
import Image from "next/image";

const FormSchema = z.object({
  first_name: z.any().optional(),
  last_name: z.any().optional(),
  email: z.any().optional(),
  city: z.any().optional(),
  address: z.any().optional(),
  country: z.any().optional(),
  phone: z.any().optional(),
  gender: z.enum(["male", "female"]).optional(),
});

interface ImagePreview {
  file: File;
  url: string;
}

const Settings = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openLog, setOpenLog] = React.useState(false);
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [dobError, setDobError] = useState("");
  const [imageChange, setImageChange] = useState(false);
  const { userData, userRefetching } = useLoggedInUser();
  const [update, { isLoading }] = useUpdateProfileMutation();

  const handleRemoveImage = (url: string) => {
    setImages((prevImages) => prevImages.filter((image) => image.url !== url));
  };

  // const handleFileChange = async (e: any) => {
  //   const file = e.target.files?.[0];

  //   if (file) {
  //     const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];

  //     if (validImageTypes.includes(file.type)) {
  //       const reader = new FileReader();

  //       reader.onloadend = () => {
  //         setPreviewSrc(reader.result as string);
  //         setImageChange(true);
  //       };

  //       reader.readAsDataURL(file);
  //       setSelectedFile(file);
  //     } else {
  //       toast.error("Please upload a valid image file (JPEG, JPG, or PNG)");
  //       setPreviewSrc("");
  //     }
  //   } else {
  //     setPreviewSrc("");
  //   }
  // };

  const handleUploadPicture = async () => {
    setLoading(true);

    try {
      if (images) {
        const formdata = new FormData();
        images &&
          images.forEach((image) => {
            formdata.append("profile_image", image.file);
          });

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
          toast.success(`Profile Image Updated!! ✅`);
          setLoading(false);
          userRefetching();
          setImages([]);
          setImageChange(false);
        }
      }
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // const handleDeleteAccount = () => {
  //   alert("clicked");
  // };

  useEffect(() => {
    if (userData) {
      form.reset({
        first_name: userData?.first_name,
        last_name: userData?.last_name,
        city: userData?.city,
        address: userData?.address,
        country: userData?.country,
        phone: userData?.phone || "088-090-9919",
        email: userData?.email,
      });

      const DOB = new Date(userData?.dob);
      setSelectedDate(DOB);
    }
  }, [userData, form]);

  const genderString =
    userData?.gender === "male"
      ? "male"
      : userData?.gender === "female"
      ? "female"
      : undefined;

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const dateString = selectedDate
      ? selectedDate.toISOString().split("T")[0]
      : null;

    const formdata = {
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      city: data.city || null,
      address: data.address || null,
      phone: data.phone || null,
      country: data.country || null,
      gender: data.gender || genderString,
      dob: dateString,
      email: data.email || null,
    };
    console.log("formdata: ", formdata);
    await update(formdata)
      .unwrap()
      .then((res: any) => {
        console.log(res);
        toast.success(`Updated Successfully!! ✅`);
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleLogout = () => {
    setOpenLog(true);
  };

  const handleImageChange = () => {
    setImageChange(true);
  };

  return (
    <div>
      <LogoutModal open={openLog} setOpen={setOpenLog} />

      <div className="space-y-8">
        <div className="flex justify-between items-center mb-5">
          <div className="font-bold text-lg">Basic Settings</div>
          <span className="flex gap-x-2">
            {/* <Button variant={"outline"} size="sm">
                  Cancel
                </Button> */}
          </span>
        </div>
        <div className="bg-white rounded-xl p-5">
          <div className="flex flex-col lg:flex-row items-center p-5 gap-3">
            <>
              <Avatar className="w-40 h-40">
                {imageChange ? (
                  <>
                    {images?.map((image, index: number) => (
                      <>
                        <AvatarImage src={image.url} />
                      </>
                    ))}
                  </>
                ) : (
                  <AvatarImage src={userData?.profile_image} />
                )}
                <AvatarFallback>
                  <IoPersonOutline className="h-14 w-14" />
                </AvatarFallback>
              </Avatar>
            </>

            <span className="flex flex-col lg:flex-row items-center gap-4">
              {images.length === 0 && !imageChange ? (
                <ImageUploader
                  setImages={setImages}
                  onImageChange={handleImageChange}
                  classname={
                    "bg-[--primary] text-white hover:text-white hover:bg-[--primary-btn] py-2 px-5 rounded-lg text-[13px] text-center cursor-pointer"
                  }
                  trigger={"Upload New"}
                  multiple={false}
                />
              ) : (
                <div
                  onClick={() => {
                    setImages([]);
                    setImageChange(false);
                  }}
                  className="bg-red-500 text-white hover:bg-red-600 py-2 px-5 rounded-lg text-[13px] cursor-pointer"
                >
                  Delete Image
                </div>
              )}

              {images.length > 0 && (
                <div
                  onClick={handleUploadPicture}
                  className="py-2 px-5 rounded-lg text-[13px] cursor-pointer border hover:bg-gray-100"
                >
                  {loading ? (
                    <FaSpinner
                      className="animate-spin w-4 h-4 text-gray-400 mx-auto"
                      size={24}
                    />
                  ) : (
                    "Upload Picture"
                  )}
                </div>
              )}
            </span>
          </div>

          <Separator />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    {/* firstName and lastName */}
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

                    {/* email and phone */}
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
                                  disabled
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
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input type="tel" className="py-6" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* city and country  */}
                    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  id="city"
                                  type="text"
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
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                                <Input
                                  id="country"
                                  type="text"
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

                    {/* dob and gender  */}
                    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                      <div>
                        <FormLabel htmlFor="dateInput">Date of Birth</FormLabel>
                        <div className="border border-gray-200 p-2 mt-2 rounded-lg flex flex-col">
                          <DatePicker
                            selected={selectedDate}
                            onChange={(date: Date | null) =>
                              setSelectedDate(date)
                            }
                            dateFormat="yyyy-MM-dd"
                            placeholderText="YYYY-MM-DD"
                            id="dateInput"
                            className="date-picker-input border-none w-full outline-none h-10 pl-3 text-base py-4 placeholder:text-sm"
                          />
                        </div>

                        {dobError ? (
                          <FormMessage className="mt-2 text-red-500">
                            {dobError}
                          </FormMessage>
                        ) : (
                          <FormDescription className="mt-2">
                            Input date of birth, not less than 18 years of age.
                            If null, defaults to 1970-01-01
                          </FormDescription>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem className="">
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                              <>
                                {userData ? (
                                  <>
                                    {userData?.gender === "male" ? (
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue="male"
                                        className="border grid grid-cols-2 p-4 mt-0 rounded-lg"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="male"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Male
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="female"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Female
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    ) : userData?.gender === "female" ? (
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={"female"}
                                        className="border grid grid-cols-2 p-4 mt-0 rounded-lg"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="male"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Male
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="female"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Female
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    ) : (
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="border grid grid-cols-2 p-4 mt-0 rounded-lg"
                                      >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="male"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Male
                                          </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                          <FormControl>
                                            <RadioGroupItem
                                              className="border-muted-foreground h-5 w-5"
                                              value="female"
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal text-base text-muted-foreground">
                                            Female
                                          </FormLabel>
                                        </FormItem>
                                      </RadioGroup>
                                    )}
                                  </>
                                ) : (
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="border grid grid-cols-2 p-4 mt-0 rounded-lg"
                                  >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem
                                          className="border-muted-foreground h-5 w-5"
                                          value="male"
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal text-base text-muted-foreground">
                                        Male
                                      </FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                      <FormControl>
                                        <RadioGroupItem
                                          className="border-muted-foreground h-5 w-5"
                                          value="female"
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal text-base text-muted-foreground">
                                        Female
                                      </FormLabel>
                                    </FormItem>
                                  </RadioGroup>
                                )}
                              </>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* address */}
                    <div className="grid grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-20">
                      <div className="grid grid-rows-1 gap-4 lg:gap-20">
                        <div className="grid gap-2">
                          <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input className="py-6" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading}
                        variant={"outline"}
                        size={"sm"}
                        className="bg-[--primary] text-white hover:text-white mt-auto py-6 hover:bg-[--primary-btn] w-full"
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner
                              className="animate-spin w-8 h-8"
                              size={24}
                            />
                          </>
                        ) : (
                          "Update"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>

          <Separator />

          <UpdatePassword />
          <Separator />

          <Card className="border-none shadow-none lg:p-5 py-5">
            <CardHeader className="px-0">
              <CardTitle className="text-lg text-gray-500">
                Account Security
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="border-none px-0 rounded-lg">
              <span className="flex flex-col lg:flex-row gap-5">
                <div
                  onClick={handleLogout}
                  className="bg-[#B3261E] text-white hover:text-white hover:bg-[#C45650] py-2 px-5 rounded-lg text-[13px] cursor-pointer"
                >
                  <span className="flex gap-x-3 justify-center items-center">
                    <LuDiamond />
                    Log Out
                  </span>
                </div>
                {/* <div
                      onClick={handleDeleteAccount}
                      className="bg-[#B3261E] text-white hover:text-white hover:bg-[#C45650] py-2 px-5 rounded-lg text-[13px] cursor-pointer"
                    >
                      <span className="flex gap-x-3 justify-center  items-center">
                        <LuDiamond />
                        Delete my account
                      </span>
                    </div> */}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
