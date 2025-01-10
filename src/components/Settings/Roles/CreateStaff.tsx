"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatSnakeCase } from "@/lib/utils";
import { useAssignRoleToUserMutation } from "@/redux/services/Slices/settings/rolesApiSlice";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const CreateStaff = ({ role }: { role: [] }) => {
  const [emailError, setEmailError] = useState("");
  const FormSchema = z.object({
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "last name is required" }),
    email: z
      .string()
      .email({ message: "Email is invalid" })
      .min(1, { message: "Email is required" }),
    gender: z.enum(["male", "female"], {
      required_error: "You need to select a gender.",
    }),
    role: z.string().min(1, { message: "Role is required" }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  const [assign, { isLoading }] = useAssignRoleToUserMutation();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      role: data.role,
      first_name: data.first_name,
      last_name: data.last_name,
      gender: data.gender,
      email: data.email,
    };

    console.log("data: ", formData);
    // await assign(formData)
    //   .unwrap()
    //   .then((res: any) => {
    //     toast.success("Successful");
    //   })
    //   .catch((error: any) => {
    //     toast.error("Error occured");
    //     setEmailError(
    //       error.response?.data?.message?.email?.map(
    //         (err: any, index: number) => (
    //           <div key={index}>
    //             <ul className="list-disc list-inside">
    //               <li>{err}</li>
    //             </ul>
    //           </div>
    //         )
    //       )
    //     );
    //   });
  };
  return (
    <div>
      {" "}
      <div className="h-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 lg:space-y-6 max-w-screen h-full lg:max-w-full"
          >
            <div className="">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="m-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id="first_name"
                        type="text"
                        placeholder="Enter first name"
                        {...field}
                        className="py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="m-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id="last_name"
                        type="text"
                        placeholder="Enter last name"
                        {...field}
                        className="py-6"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="m-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email"
                        {...field}
                        className="py-6"
                      />
                    </FormControl>
                    {!emailError ? <FormMessage /> : ""}
                    {emailError && <FormMessage>{emailError}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-2 mt-0 "
                        >
                          <FormItem className="flex items-center border rounded-lg space-x-3 space-y-0 p-4">
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
                          <FormItem className="flex items-center space-x-3 border rounded-lg p-4 space-y-0">
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
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="m-1">
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <SelectTrigger className="py-6">
                          <SelectValue
                            className="text-gray-400"
                            placeholder="Enter role"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {role
                          ?.filter(
                            (category: any) =>
                              category?.name !== "driver" &&
                              category?.name !== "agent" &&
                              category?.name !== "passenger"
                          )
                          .map((category: any, i: number) => (
                            <SelectItem
                              key={i}
                              value={category?.name}
                              className="capitalize"
                            >
                              {formatSnakeCase(category?.name)}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-[--primary] hover:bg-[--primary-btn] hover:text-white"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateStaff;
