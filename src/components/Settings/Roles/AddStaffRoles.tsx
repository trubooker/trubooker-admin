// import React from 'react'

// const AddStaffRoles = () => {
//   return (
//     <div>AddStaffRoles</div>
//   )
// }

// export default AddStaffRoles

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const permissions = [
  {
    category: "Financial Access",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "User Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Database Management",
    options: ["Read", "Write", "Create"],
  },
];

const FormSchema = z.object({
  name: z.string().min(1, { message: "Required Field" }),
  email: z.string().email().min(1, { message: "Email is required" }),
  permissions: z
    .array(
      z.object({
        category: z.string(),
        options: z.array(z.string()),
      })
    )
    .refine((value) => value.some((item) => item.options.length > 0), {
      message: "You must select at least one permission.",
    }),
});

export function AddStaffRoles() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      permissions: permissions.map((perm) => ({
        category: perm.category,
        options: [],
      })),
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  const handleGlobalSelectAll = (checked: boolean) => {
    form.setValue(
      "permissions",
      permissions.map((perm) => ({
        category: perm.category,
        options: checked ? ["Read", "Write", "Create"] : [],
      }))
    );
  };

  return (
    <div className="h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6 max-w-screen h-full lg:max-w-full"
        >
          <div className="grid gap-2 text-gray-500">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mx-1">
                  <FormLabel htmlFor="password">Name</FormLabel>
                  <FormControl>
                    <Input id="name" type="text" {...field} className="py-6" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mx-1">
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

          {/* Global Select All */}
          <div className="flex justify-between items-center my-5">
            <FormLabel className="font-bold">Administrator Access</FormLabel>
            <div className="flex items-center space-x-2">
              <Checkbox
                onCheckedChange={(checked) =>
                  handleGlobalSelectAll(checked as boolean)
                }
              />
              <FormLabel>Select All</FormLabel>
            </div>
          </div>
          <Separator />
          {/* Permissions Grid */}
          {permissions.map((perm) => (
            <>
              <div
                key={perm.category}
                className=" lg:flex lg:justify-between items-center"
              >
                <div className="flex justify-between lg:w-[40%] mb-3 lg:mb-0 items-center">
                  <FormLabel>{perm.category}</FormLabel>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {perm.options.map((option) => (
                    <FormField
                      key={option}
                      control={form.control}
                      name="permissions"
                      render={() => {
                        const field = form
                          .getValues("permissions")
                          .find((p) => p.category === perm.category);
                        return (
                          <FormItem className="flex items-end space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field?.options.includes(option)}
                                onCheckedChange={(checked) => {
                                  form.setValue(
                                    "permissions",
                                    form.getValues("permissions").map((p) =>
                                      p.category === perm.category
                                        ? {
                                            ...p,
                                            options: checked
                                              ? [...p.options, option]
                                              : p.options.filter(
                                                  (o) => o !== option
                                                ),
                                          }
                                        : p
                                    )
                                  );
                                }}
                              />
                            </FormControl>
                            <FormLabel>{option}</FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
              <Separator />
            </>
          ))}

          {/* Submit Button */}
          <div className="w-full">
            <Button
              type="submit"
              variant="outline"
              className="bg-[--primary] hover:bg-[--primary-btn] text-white hover:text-white w-full"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
