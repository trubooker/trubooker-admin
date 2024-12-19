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
import { Separator } from "../../ui/separator";
import {
  useGetPermissionsQuery,
  useUpdateRolesMutation,
} from "@/redux/services/Slices/settings/rolesApiSlice";
import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { formatSnakeCase, AppendToSnakeCase } from "@/lib/utils";
import toast from "react-hot-toast";

const FormSchema = z.object({
  name: z.string().min(1, { message: "Required Field" }),
  permissions: z
    .array(z.number())
    .min(1, { message: "Select at least one permission." }),
});

export function EditRoles({
  role,
  allRoles,
}: {
  role: string;
  allRoles: any[];
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      permissions: [],
    },
  });

  const { data, isLoading: permissionsLoading } = useGetPermissionsQuery(null);
  const permissions = data?.data || [];
  const selectedRoleData = allRoles.find((r) => r.name === role);

  const [update, { isLoading }] = useUpdateRolesMutation();

  useEffect(() => {
    if (selectedRoleData) {
      form.setValue("name", formatSnakeCase(selectedRoleData.name));
      const preSelectedPermissions = selectedRoleData.permissions?.map(
        (perm: any) => perm.id
      );
      form.setValue("permissions", preSelectedPermissions || []);
    }
  }, [selectedRoleData, form]);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    const currentPermissions = form.getValues("permissions");
    const updatedPermissions = checked
      ? [...currentPermissions, id] // Add ID if checked
      : currentPermissions.filter((permId) => permId !== id); // Remove ID if unchecked
    form.setValue("permissions", updatedPermissions);
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      id: selectedRoleData?.id,
      name: AppendToSnakeCase(data.name),
      permissions: data.permissions,
    };

    console.log("Updated Role Data: ", formData);
    await update(formData)
      .unwrap()
      .then((res) => {
        toast.success("Successful");
      })
      .catch((res) => {
        toast.error("Error occured");
      });
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 lg:space-y-6 max-w-screen lg:max-w-full"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="m-1">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input id="name" type="text" {...field} className="py-6" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permissions Grid */}
          <div className="space-y-2 m-1">
            <FormLabel>Permissions</FormLabel>
            <Separator />
            {permissionsLoading ? (
              <p>Loading permissions...</p>
            ) : (
              permissions.map((perm: any) => (
                <div key={perm.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`permission-${perm.id}`}
                    checked={form.watch("permissions").includes(perm.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(perm.id, !!checked)
                    }
                  />
                  <label
                    htmlFor={`permission-${perm.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {perm.name}
                  </label>
                </div>
              ))
            )}
          </div>

          <div className="w-full">
            <Button
              type="submit"
              variant="outline"
              disabled={isLoading || permissionsLoading}
              className="bg-[--primary] hover:bg-[--primary-btn] text-white hover:text-white w-full"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
