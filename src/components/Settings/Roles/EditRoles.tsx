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
} from "@/components/ui/form";
import { Separator } from "../../ui/separator";
import {
  useGetPermissionsByIdQuery,
  useGetPermissionsQuery,
  useGetRolesByIdQuery,
} from "@/redux/services/Slices/settings/rolesApiSlice";
import React, { useEffect } from "react";

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

export function EditRoles({ role, allRoles }: { role: string; allRoles: any[] }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  // Find the exact role data
  const selectedRoleData = allRoles.find((r) => r.name === role);

  // Log the selected role for debugging
  console.log("Selected Role Data: ", selectedRoleData);

  useEffect(() => {
    if (selectedRoleData) {
      // Pre-fill the form with the selected role's name and permissions
      form.setValue("name", selectedRoleData.name);
      form.setValue("permissions", selectedRoleData.permissions || []);
    }
  }, [selectedRoleData, form]);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    const formData = {
      name: data.name,
      role: selectedRoleData?.id,
      permissions: data.permissions,
    };

    console.log("Updated Role Data: ", formData);
    // Perform API request or other actions here
  };

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
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6 max-w-screen lg:max-w-full"
        >
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
          <Separator />

          {/* Permissions Grid */}
          {permissions.map((perm) => (
            <React.Fragment key={perm.category}>
              <div className="lg:flex lg:justify-between items-center">
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
            </React.Fragment>
          ))}

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
