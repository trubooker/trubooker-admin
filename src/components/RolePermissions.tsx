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
import { Separator } from "./ui/separator";
import { DialogClose } from "./ui/dialog";

const permissions = [
  //   {
  //     category: "Administrator Access",
  //     options: ["Read", "Write", "Create"],
  //   },
  {
    category: "User Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Content Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Disputes Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Database Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Financial Management",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "API Control",
    options: ["Read", "Write", "Create"],
  },
  {
    category: "Repository Management",
    options: ["Read", "Write", "Create"],
  },
];

const FormSchema = z.object({
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

export function RolePermissions({ id }: any) {
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
    alert(JSON.stringify(data, null, 2));
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 lg:space-y-6 max-w-screen lg:max-w-full"
      >
        {/* Global Select All */}
        <div className="flex justify-between items-center">
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
  );
}
